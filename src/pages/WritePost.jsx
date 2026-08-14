import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import imageIcon from '../assets/image.svg';
import voteIcon from '../assets/vote.svg';
import CategoryChip from '../components/CategoryChip';
import Toggle from '../components/Toggle';
import { POSTS, POST_CATEGORIES } from '../constants/community';
import { CURRENT_USER_NAME } from '../constants/home';
import '../styles/WritePost.css';

const GUIDE_ITEMS = [
  '서로를 존중하는 따뜻한 대화를 나눠주세요',
  '개인정보(연락처, 주소 등) 및 타인의 정보는 공유하지 마세요.',
  '허위 정보, 비방, 광고성 글은 사전 안내 없이 삭제될 수 있어요.',
];

function WritePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && category !== null;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newPost = {
      id: Date.now(),
      category,
      title: title.trim(),
      description: content.trim(),
      author: anonymous ? '익명' : CURRENT_USER_NAME,
      time: '방금 전',
      createdAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      images: images.map((image) => image.url),
      content: [content.trim()],
      comments: [],
    };
    POSTS.unshift(newPost);
    navigate('/community');
  };

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
        <h1>글쓰기</h1>
        <button
          type="button"
          className={`write-submit${canSubmit ? ' write-submit--active' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          등록
        </button>
      </header>

      <div className="write-body">
        <div className="write-section">
          <p className="write-label">제목</p>
          <div className="write-input-box">
            <input
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

        <div className="write-content-box">
          <textarea
            className="write-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            maxLength={2000}
          />
          <p className="write-counter write-counter--inside">{content.length}/2000</p>
        </div>

        <div className="write-tools">
          <button type="button" className="write-tool-btn" onClick={handlePhotoClick}>
            <span>사진</span>
            <img src={imageIcon} alt="" />
          </button>
          <button type="button" className="write-tool-btn" disabled>
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

        <div className="write-toggle-row">
          <div>
            <p className="write-toggle-title">익명으로 작성하기</p>
            <p className="write-toggle-desc">이름 대신 '익명'으로 표시돼요</p>
          </div>
          <Toggle checked={anonymous} onChange={setAnonymous} ariaLabel="익명으로 작성하기" />
        </div>

        <div className="write-toggle-row">
          <div>
            <p className="write-toggle-title">알림 설정</p>
            <p className="write-toggle-desc">댓글이 달리면 알림을 받을 수 있어요</p>
          </div>
          <Toggle checked={notifyEnabled} onChange={setNotifyEnabled} ariaLabel="알림 설정" />
        </div>

        <div className="write-guide-box">
          <p className="write-guide-title">커뮤니티 이용 안내</p>
          <ul className="write-guide-list">
            {GUIDE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WritePost;
