import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import birdLogo from '../assets/bird_logo.svg';
import pencil from '../assets/pencil.svg';
import alarm from '../assets/alarm.svg';
import BottomNav from '../components/BottomNav';
import SettingsRow from '../components/SettingsRow';
import LoginRequiredModal from '../components/LoginRequiredModal';
import Modal from '../components/Modal';
import useBookmarks from '../hooks/useBookmarks';
import useNotifications from '../hooks/useNotifications';
import useAvatar from '../hooks/useAvatar';
import useApplication from '../hooks/useApplication';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';
import { APPLICATION_STATS, APP_VERSION } from '../constants/mypage';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const { bookmarkedIds } = useBookmarks();
  const { hasUnread } = useNotifications();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const { appliedCount } = useApplication();
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [profileError, setProfileError] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProfile = useCallback(() => {
    if (!isLoggedIn) return;
    setProfileError(false);
    getMyProfile()
      .then((data) => {
        if (!isMountedRef.current) return;
        setProfile({ username: data.username, email: data.email });
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        setProfileError(true);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handlePickAlbum = () => {
    setPhotoModalOpen(false);
    fileInputRef.current.click();
  };

  const handleResetDefault = () => {
    setPhotoModalOpen(false);
    setAvatarUrl(null);
  };

  return (
    <div className="mypage">
      <div className="mypage-scroll">
        <div className="mypage-hero">
          <button
            type="button"
            className="mypage-alarm-btn"
            aria-label="알림"
            onClick={() => navigate('/mypage/notifications')}
          >
            <img src={alarm} alt="" className="mypage-alarm-icon" />
            {hasUnread && <span className="mypage-alarm-dot" />}
          </button>

          <div className="mypage-avatar-wrap">
            <div className="mypage-avatar-frame">
              <img
                src={avatarUrl || birdLogo}
                alt=""
                className={`mypage-avatar-img${avatarUrl ? ' mypage-avatar-img--custom' : ''}`}
              />
            </div>
            <button
              type="button"
              className="mypage-avatar-edit"
              aria-label="프로필 사진 변경"
              onClick={() => setPhotoModalOpen(true)}
            >
              <img src={pencil} alt="" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mypage-avatar-input"
            />
          </div>

          {!isLoggedIn ? (
            <p className="mypage-name">로그인이 필요해요</p>
          ) : profileError ? (
            <div className="mypage-profile-error">
              <p className="mypage-name">정보를 불러오지 못했어요</p>
              <button type="button" className="mypage-retry-btn" onClick={fetchProfile}>
                다시 시도
              </button>
            </div>
          ) : (
            <p className="mypage-name">{profile.username}</p>
          )}
        </div>

        <div className="mypage-stats">
          <div className="mypage-stat">
            <span className="mypage-stat-label">신청 완료</span>
            <span className="mypage-stat-value">{appliedCount}회</span>
          </div>
          <span className="mypage-stat-divider" />
          <div className="mypage-stat">
            <span className="mypage-stat-label">신청 대기</span>
            <span className="mypage-stat-value">{APPLICATION_STATS.pending}회</span>
          </div>
          <span className="mypage-stat-divider" />
          <button
            type="button"
            className="mypage-stat mypage-stat--link"
            onClick={() => navigate('/bookmark')}
          >
            <span className="mypage-stat-label">북마크</span>
            <span className="mypage-stat-value">{bookmarkedIds.length}개</span>
          </button>
        </div>

        <section className="mypage-section">
          <h2 className="mypage-section-title">계정</h2>
          <div className="mypage-card">
            <SettingsRow
              label="이메일"
              value={profile.email}
              chevron
              onClick={() => navigate('/mypage/email')}
            />
            <SettingsRow
              label="비밀번호 변경"
              chevron
              onClick={() => navigate('/mypage/password')}
            />
            <SettingsRow label="아이디 변경" chevron onClick={() => navigate('/mypage/id')} />
          </div>
        </section>

        <section className="mypage-section">
          <h2 className="mypage-section-title">커뮤니티</h2>
          <div className="mypage-card">
            <SettingsRow label="내가 쓴 글" chevron onClick={() => navigate('/mypage/posts')} />
            <SettingsRow
              label="내가 쓴 댓글"
              chevron
              onClick={() => navigate('/mypage/comments')}
            />
          </div>
        </section>

        <section className="mypage-section mypage-section--last">
          <h2 className="mypage-section-title">기타</h2>
          <div className="mypage-card">
            <SettingsRow label="문의하기" chevron />
            <SettingsRow label="약관 및 정책" chevron />
            <SettingsRow label="버전 정보" value={APP_VERSION} />
          </div>
        </section>
      </div>

      <BottomNav />

      <Modal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        title="프로필 사진 변경"
        description="프로필 사진을 변경하시겠습니까?"
      >
        <div className="modal-actions modal-actions--stacked">
          <button type="button" className="modal-btn modal-btn--confirm" onClick={handlePickAlbum}>
            앨범에서 선택
          </button>
          <button
            type="button"
            className="modal-btn modal-btn--cancel"
            onClick={handleResetDefault}
          >
            기본 이미지로 변경
          </button>
        </div>
      </Modal>

      <LoginRequiredModal open={!isLoggedIn} onClose={() => navigate('/home')} />
    </div>
  );
}

export default MyPage;
