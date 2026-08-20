import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import birdLogo from '../assets/bird_logo.svg';
import pencil from '../assets/pencil.svg';
import alarm from '../assets/alarm.svg';
import BottomNav from '../components/BottomNav';
import SettingsRow from '../components/SettingsRow';
import LoginRequiredModal from '../components/LoginRequiredModal';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import useBookmarks from '../hooks/useBookmarks';
import useNotifications from '../hooks/useNotifications';
import useAvatar from '../hooks/useAvatar';
import useApplication from '../hooks/useApplication';
import { getMyProfile, uploadProfileImage } from '../api/mypage';
import { getAccessToken, clearTokens } from '../api/auth';
import { toSecureImageUrl } from '../utils/formatters';
import { APP_VERSION } from '../constants/mypage';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const { bookmarkedIds } = useBookmarks();
  const { hasUnread, refetch: refetchNotifications } = useNotifications();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const { appliedCount } = useApplication();
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [profileError, setProfileError] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('default');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) refetchNotifications();
  }, [isLoggedIn, refetchNotifications]);

  const fetchProfile = useCallback(() => {
    if (!isLoggedIn) return;
    setProfileError(false);
    getMyProfile()
      .then((data) => {
        if (!isMountedRef.current) return;
        setProfile({ username: data.username, email: data.email });
        setAvatarUrl(data.profileImage ? toSecureImageUrl(data.profileImage) : null);
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        setProfileError(true);
      });
  }, [isLoggedIn, setAvatarUrl]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const showToast = (message, variant = 'default') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVariant(variant);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 1600);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || avatarUploading) return;

    const previousAvatarUrl = avatarUrl;
    setAvatarUrl(URL.createObjectURL(file));
    setAvatarUploading(true);

    uploadProfileImage(file)
      .then((data) => {
        if (!isMountedRef.current) return;
        setAvatarUrl(toSecureImageUrl(data.profileImage));
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        setAvatarUrl(previousAvatarUrl);
        showToast('프로필 사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요', 'warning');
      })
      .finally(() => {
        if (!isMountedRef.current) return;
        setAvatarUploading(false);
      });
  };

  const handlePickAlbum = () => {
    setPhotoModalOpen(false);
    fileInputRef.current.click();
  };

  const handleResetDefault = () => {
    setPhotoModalOpen(false);
    setAvatarUrl(null);
  };

  const handleLogout = () => {
    clearTokens();
    setLogoutModalOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="mypage">
      <Toast message={toastMessage} visible={Boolean(toastMessage)} variant={toastVariant} />

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
              disabled={avatarUploading}
            >
              <img src={pencil} alt="" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mypage-avatar-input"
              disabled={avatarUploading}
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
          <button
            type="button"
            className="mypage-stat mypage-stat--link"
            onClick={() => navigate('/mypage/applications')}
          >
            <span className="mypage-stat-label">신청</span>
            <span className="mypage-stat-value">{appliedCount}건</span>
          </button>

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

        <section className="mypage-section">
          <h2 className="mypage-section-title">계정 관리</h2>
          <div className="mypage-card">
            <SettingsRow label="로그아웃" chevron onClick={() => setLogoutModalOpen(true)} />
            <SettingsRow
              label="회원 탈퇴"
              chevron
              danger
              onClick={() => navigate('/mypage/withdraw')}
            />
          </div>
        </section>

        <section className="mypage-section mypage-section--last">
          <h2 className="mypage-section-title">기타</h2>
          <div className="mypage-card">
            <SettingsRow label="문의하기" chevron onClick={() => navigate('/mypage/inquiry')} />
            <SettingsRow label="약관 및 정책" chevron onClick={() => navigate('/mypage/terms')} />
            <SettingsRow
              label="버전 정보"
              value={APP_VERSION}
              chevron
              onClick={() => navigate('/mypage/version')}
            />
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

      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        danger
        onConfirm={handleLogout}
      />

      <LoginRequiredModal open={!isLoggedIn} onClose={() => navigate('/home')} />
    </div>
  );
}

export default MyPage;
