import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import imageIcon from '../assets/image.svg';
import voteIcon from '../assets/vote.svg';
import chartIcon from '../assets/chart.svg';
import CategoryChip from '../components/CategoryChip';
import Toggle from '../components/Toggle';
import PollFormSheet from '../components/PollFormSheet';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginRequiredModal from '../components/LoginRequiredModal';
import { POST_CATEGORIES, LABEL_TO_BOARD_TYPE, BOARD_TYPE_TO_LABEL } from '../constants/community';
import { createPost, getPost, updatePost } from '../api/community';
import { getAccessToken } from '../api/auth';
import { toSecureImageUrl } from '../utils/formatters';
import '../styles/WritePost.css';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const GUIDE_ITEMS = [
  '서로를 존중하는 따뜻한 대화를 나눠주세요',
  '개인정보(연락처, 주소 등) 및 타인의 정보는 공유하지 마세요.',
  '허위 정보, 비방, 광고성 글은 사전 안내 없이 삭제될 수 있어요.',
];

// PollFormSheet가 options를 문자열 배열로 넘겨주는데, 백엔드 PollCreateSerializer는
// options를 [{ text }] 형태로 기대해서 여기서 변환해줌
function toPollPayload(poll) {
  if (!poll) return undefined;
  return {
    question: poll.question,
    allowMultiple: Boolean(poll.allowMultiple),
    options: poll.options.map((text) => ({ text })),
  };
}

// JSON.stringify로 비교하면 키 순서가 달라졌을 때 오작동할 수 있어서 필드별로 비교
function arePollsEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.question !== b.question) return false;
  if (Boolean(a.allowMultiple) !== Boolean(b.allowMultiple)) return false;
  if (a.options.length !== b.options.length) return false;
  return a.options.every((option, index) => option === b.options[index]);
}

function WritePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록)
  const isLoggedIn = Boolean(getAccessToken());
  const [existingPost, setExistingPost] = useState(null);
  const [postLoading, setPostLoading] = useState(isEdit);
  const [postError, setPostError] = useState(false);
  const [postNotFound, setPostNotFound] = useState(false);
  const [originalPoll, setOriginalPoll] = useState(null);
  const [pollHasVotes, setPollHasVotes] = useState(false);

  const originalTitle = existingPost?.title || '';
  const originalContent = existingPost?.content || '';
  const originalNotify = existingPost?.allowNotification ?? true;
  const originalCategory = existingPost
    ? BOARD_TYPE_TO_LABEL[existingPost.boardType] || null
    : null;
  const originalImageIds = existingPost
    ? (existingPost.images || []).map((image) => `existing-${image.id}`)
    : [];

  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [images, setImages] = useState([]);
  const [poll, setPoll] = useState(null);
  const [pollSheetOpen, setPollSheetOpen] = useState(false);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imagesRef = useRef(images);
  const submittedUrlsRef = useRef(new Set());

  //  요청마다 세대 번호를 매겨서 최신 요청의 응답만 반영
  const postRequestIdRef = useRef(0);
  // StrictMode 개발 모드에서 effect가 두 번 실행돼서 GET을 중복으로 보내는 것도 막아줌
  const fetchedPostIdRef = useRef(null);

  const fetchExistingPost = useCallback(() => {
    if (!isEdit || !isLoggedIn) return;
    const requestId = ++postRequestIdRef.current;
    setPostLoading(true);
    setPostError(false);
    setPostNotFound(false);
    getPost(id)
      .then((data) => {
        if (requestId !== postRequestIdRef.current) return;
        setExistingPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setCategory(BOARD_TYPE_TO_LABEL[data.boardType] || null);
        setNotifyEnabled(data.allowNotification ?? true);
        setImages(
          (data.images || [])
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((image) => ({
              id: `existing-${image.id}`,
              url: toSecureImageUrl(image.image),
              isExisting: true,
            })),
        );
        const pollFromData = data.poll
          ? {
              question: data.poll.question,
              options: data.poll.options.map((option) => option.text),
              allowMultiple: data.poll.allowMultiple,
            }
          : null;
        setPoll(pollFromData);
        setOriginalPoll(pollFromData);
        setPollHasVotes(Boolean(data.poll?.totalVoters > 0));
      })
      .catch((error) => {
        if (requestId !== postRequestIdRef.current) return;
        if (error.response?.status === 404) {
          setPostNotFound(true);
        } else {
          setPostError(true);
        }
      })
      .finally(() => {
        if (requestId !== postRequestIdRef.current) return;
        setPostLoading(false);
      });
  }, [isEdit, id, isLoggedIn]);

  useEffect(() => {
    if (!isEdit || !isLoggedIn) return;
    if (fetchedPostIdRef.current === id) return;
    fetchedPostIdRef.current = id;
    fetchExistingPost();
  }, [isEdit, isLoggedIn, id, fetchExistingPost]);

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

  const pollChanged = !arePollsEqual(poll, originalPoll);

  const currentExistingImageIds = images
    .filter((image) => image.isExisting)
    .map((image) => image.id);
  const hasNewImages = images.some((image) => !image.isExisting);
  const imagesRemoved = originalImageIds.some(
    (imageId) => !currentExistingImageIds.includes(imageId),
  );
  const imagesChanged = hasNewImages || imagesRemoved;

  const isDirty =
    !isEdit ||
    title.trim() !== originalTitle ||
    content !== originalContent ||
    notifyEnabled !== originalNotify ||
    category !== originalCategory ||
    imagesChanged ||
    (!pollHasVotes && pollChanged);

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
      setSubmitError('');
      setIsSubmitting(true);

      const keptExistingImageIds = images
        .filter((image) => image.isExisting)
        .map((image) => Number(image.id.replace('existing-', '')));
      const newImageFiles = images.filter((image) => !image.isExisting).map((image) => image.file);

      try {
        const updated = await updatePost(existingPost.id, {
          title: title.trim(),
          content: content.trim(),
          allowNotification: notifyEnabled,
          boardType: category !== originalCategory ? LABEL_TO_BOARD_TYPE[category] : undefined,
          poll: !pollHasVotes && pollChanged ? toPollPayload(poll) : undefined,
          keepImageIds: imagesRemoved ? keptExistingImageIds : undefined,
          newImages: newImageFiles,
        });

        navigate(`/community/${updated.id}`, { replace: true });
      } catch (error) {
        setIsSubmitting(false);
        const message = error.response?.data?.message;
        setSubmitError(message || '게시글 수정에 실패했어요. 다시 시도해주세요');
      }
      return;
    }

    const boardType = LABEL_TO_BOARD_TYPE[category];
    if (!boardType) {
      setSubmitError('카테고리를 다시 선택해주세요');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    const pollPayload = toPollPayload(poll);

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
      // replace: true로 글쓰기 화면을 히스토리에서 빼줘야 상세에서 뒤로가기 눌렀을 때
      // 글쓰기 화면이 아니라 글 목록으로 돌아감
      navigate(`/community/${createdPost.id}`, { replace: true });
    } catch (error) {
      setIsSubmitting(false);
      const message = error.response?.data?.message;
      setSubmitError(message || '게시글 등록에 실패했어요. 다시 시도해주세요');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="write-page">
        <LoginRequiredModal
          open
          onClose={() => navigate('/community')}
          description="로그인하고 게시글을 작성해보세요"
        />
      </div>
    );
  }

  if (isEdit && postLoading) {
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
          <h1>게시글 수정</h1>
        </header>
        <div className="write-loading-state">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isEdit && (postNotFound || postError || !existingPost)) {
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
          <h1>게시글 수정</h1>
        </header>
        <div className="write-loading-state">
          {postNotFound ? (
            <p>게시글을 찾을 수 없습니다.</p>
          ) : (
            <ErrorState message="게시글을 불러오지 못했어요" onRetry={fetchExistingPost} />
          )}
        </div>
      </div>
    );
  }

  if (isEdit && !existingPost.isMine) {
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
          {isSubmitting ? (isEdit ? '수정 중' : '등록 중') : isEdit ? '수정' : '등록'}
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
          <button
            type="button"
            className="write-tool-btn"
            onClick={() => setPollSheetOpen(true)}
            disabled={isEdit && pollHasVotes}
          >
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

        {isEdit && pollHasVotes && (
          <p className="write-hint-text">투표가 진행된 설문은 수정할 수 없어요</p>
        )}

        {imageError && (
          <p className="write-error-text" role="alert">
            {imageError}
          </p>
        )}

        {poll && (
          <div className="write-poll-card">
            <img src={chartIcon} alt="" />
            <span>투표를 추가했어요!</span>
            {!pollHasVotes && (
              <button type="button" onClick={() => setPollSheetOpen(true)}>
                수정
              </button>
            )}
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
