import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import imageIcon from '../assets/image.svg';
import voteIcon from '../assets/vote.svg';
import chartIcon from '../assets/chart.svg';
import CategoryChip from '../components/CategoryChip';
import Toggle from '../components/Toggle';
import PollFormSheet from '../components/PollFormSheet';
import { POSTS, POST_CATEGORIES, LABEL_TO_BOARD_TYPE } from '../constants/community';
import { createPost } from '../api/community';
import '../styles/WritePost.css';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const GUIDE_ITEMS = [
  '서로를 존중하는 따뜻한 대화를 나눠주세요',
  '개인정보(연락처, 주소 등) 및 타인의 정보는 공유하지 마세요.',
  '허위 정보, 비방, 광고성 글은 사전 안내 없이 삭제될 수 있어요.',
];

function WritePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existingPost = isEdit ? POSTS.find((item) => String(item.id) === id) : null;
  const canEditPost = !isEdit || existingPost?.isMine === true;
  const originalTitle = existingPost?.title || '';
  const originalContent = existingPost ? existingPost.content.join('\n\n') : '';
  const originalCategory = existingPost?.category || null;
  const originalImageUrls = existingPost?.images || [];
  const originalPoll = existingPost?.poll || null;

  const fileInputRef = useRef(null);
  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState(existingPost ? existingPost.content.join('\n\n') : '');
  const [category, setCategory] = useState(existingPost?.category || null);
  const [anonymous, setAnonymous] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [images, setImages] = useState(
    () =>
      existingPost?.images?.map((url, index) => ({
        id: `existing-${index}`,
        url,
        isExisting: true,
      })) || [],
  );
  const [poll, setPoll] = useState(existingPost?.poll || null);
  const [pollSheetOpen, setPollSheetOpen] = useState(false);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imagesRef = useRef(images);
  const submittedUrlsRef = useRef(new Set());

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    const submittedUrls = submittedUrlsRef.current;
    return () => {
      imagesRef.current.forEach((image) => {
        if (!image.isExisting && !submittedUrls.has(image.url)) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  const isDirty =
    !isEdit ||
    title.trim() !== originalTitle ||
    content !== originalContent ||
    category !== originalCategory ||
    JSON.stringify(images.map((image) => image.url)) !== JSON.stringify(originalImageUrls) ||
    JSON.stringify(poll) !== JSON.stringify(originalPoll);

  const canSubmit =
    title.trim().length > 0 && content.trim().length > 0 && category !== null && isDirty;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const rejected = [];
    const accepted = [];
    files.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        rejected.push(`${file.name} (JPEG, PNG, WEBP만 가능)`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        rejected.push(`${file.name} (5MB 초과)`);
        return;
      }
      accepted.push(file);
    });

    const allowedCount = Math.max(0, MAX_IMAGES - images.length);
    const overflowCount = Math.max(0, accepted.length - allowedCount);
    const filesToAdd = accepted.slice(0, allowedCount);

    const newImages = filesToAdd.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);

    if (rejected.length > 0) {
      setImageError(`업로드할 수 없는 파일이 있어요: ${rejected.join(', ')}`);
    } else if (overflowCount > 0) {
      setImageError(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있어요`);
    } else {
      setImageError('');
    }
  };

  const handleRemoveImage = (id) => {
    setImageError('');
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target && !target.isExisting) URL.revokeObjectURL(target.url);
      return prev.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    if (isEdit) {
      if (!existingPost?.isMine) return;
      const nextImageUrls = images.map((image) => image.url);
      (existingPost.images || []).forEach((url) => {
        if (url.startsWith('blob:') && !nextImageUrls.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
      // existingPost.images가 이 blob URL들을 계속 들고 있어야 해서(mock 데이터),
      // unmount cleanup이 지워버리지 않도록 제출된 URL로 등록해둠
      images.forEach((image) => submittedUrlsRef.current.add(image.url));
      existingPost.category = category;
      existingPost.title = title.trim();
      existingPost.description = content.trim();
      existingPost.content = content.trim().split(/\n\s*\n/);
      existingPost.images = nextImageUrls;
      existingPost.poll = poll;
      navigate(`/community/${existingPost.id}`);
      return;
    }

    // 백엔드가 아직 multipart 요청 안에서 poll을 파싱하지 못해서 이미지+poll 동시 등록은 막아둠
    if (images.length > 0 && poll) {
      setSubmitError('이미지와 투표는 아직 함께 등록할 수 없어요. 하나만 선택해주세요');
      return;
    }

    const boardType = LABEL_TO_BOARD_TYPE[category];
    if (!boardType) {
      setSubmitError('카테고리를 다시 선택해주세요');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    // PollFormSheet가 options를 문자열 배열로 넘겨주는데, 백엔드 PollCreateSerializer는
    // options를 [{ text }] 형태로 기대해서 여기서 변환해줌
    const pollPayload = poll
      ? {
          question: poll.question,
          allowMultiple: Boolean(poll.allowMultiple),
          options: poll.options.map((text) => ({ text })),
        }
      : undefined;

    try {
      const createdPost = await createPost(boardType, {
        title: title.trim(),
        content: content.trim(),
        isAnonymous: anonymous,
        allowNotification: notifyEnabled,
        images: images.map((image) => image.file).filter(Boolean),
        poll: pollPayload,
      });
      // 실제 이미지는 서버에 업로드됐고 여기 blob 미리보기 URL은 더 필요 없으니
      // submittedUrlsRef에 등록하지 않아서 unmount cleanup이 정상적으로 해제하게 둠
      navigate(`/community/${createdPost.id}`);
    } catch (error) {
      setIsSubmitting(false);
      const message = error.response?.data?.message;
      setSubmitError(message || '게시글 등록에 실패했어요. 다시 시도해주세요');
    }
  };

  if (!canEditPost) {
    return <Navigate to="/community" replace />;
  }

  return (
    <div className="write-page">
      <header className="write-header">
        <button
          type="button"
          className="write-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>{isEdit ? '게시글 수정' : '글쓰기'}</h1>
        <button
          type="button"
          className={`write-submit${canSubmit ? ' write-submit--active' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? '등록 중' : isEdit ? '수정' : '등록'}
        </button>
      </header>

      <div className="write-body">
        <div className="write-section">
          <label className="write-label" htmlFor="write-title-input">
            제목
          </label>
          <div className="write-input-box">
            <input
              id="write-title-input"
              className="write-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={50}
            />
          </div>
          <p className="write-counter">{title.length}/50</p>
        </div>

        <div className="write-section">
          <p className="write-label">카테고리</p>
          <div className="write-category-list">
            {POST_CATEGORIES.map((item) => (
              <CategoryChip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => setCategory(item)}
              />
            ))}
          </div>
        </div>

        <div className="write-content-group">
          <div className="write-content-box">
            <textarea
              className="write-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요"
              aria-label="내용"
              maxLength={2000}
            />
          </div>
          <p className="write-counter">{content.length}/2000</p>
        </div>

        <div className="write-tools">
          <button type="button" className="write-tool-btn" onClick={handlePhotoClick}>
            <span>사진</span>
            <img src={imageIcon} alt="" />
          </button>
          <button type="button" className="write-tool-btn" onClick={() => setPollSheetOpen(true)}>
            <span>투표</span>
            <img src={voteIcon} alt="" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </div>

        {imageError && (
          <p className="write-error-text" role="alert">
            {imageError}
          </p>
        )}

        {poll && (
          <div className="write-poll-card">
            <img src={chartIcon} alt="" />
            <span>투표를 추가했어요!</span>
            <button type="button" onClick={() => setPollSheetOpen(true)}>
              수정
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="write-image-preview">
            {images.map((image) => (
              <div key={image.id} className="write-image-preview-item">
                <img src={image.url} alt="" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  aria-label="이미지 삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {!isEdit && (
          <div className="write-toggle-row">
            <div>
              <p className="write-toggle-title">익명으로 작성하기</p>
              <p className="write-toggle-desc">이름 대신 '익명'으로 표시돼요</p>
            </div>
            <Toggle checked={anonymous} onChange={setAnonymous} ariaLabel="익명으로 작성하기" />
          </div>
        )}

        <div className="write-toggle-row">
          <div>
            <p className="write-toggle-title">알림 설정</p>
            <p className="write-toggle-desc">댓글이 달리면 알림을 받을 수 있어요</p>
          </div>
          <Toggle checked={notifyEnabled} onChange={setNotifyEnabled} ariaLabel="알림 설정" />
        </div>

        {submitError && (
          <p className="write-error-text" role="alert">
            {submitError}
          </p>
        )}

        <div className="write-guide-box">
          <p className="write-guide-title">커뮤니티 이용 안내</p>
          <ul className="write-guide-list">
            {GUIDE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <PollFormSheet
        open={pollSheetOpen}
        onClose={() => setPollSheetOpen(false)}
        initialValue={poll}
        onSubmit={setPoll}
      />
    </div>
  );
}

export default WritePost;
