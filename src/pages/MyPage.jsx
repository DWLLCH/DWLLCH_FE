import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import birdLogo from '../assets/bird_logo.svg';
import pencil from '../assets/pencil.svg';
import alarm from '../assets/alarm.svg';
import BottomNav from '../components/BottomNav';
import SettingsRow from '../components/SettingsRow';
import useBookmarks from '../hooks/useBookmarks';
import useNotifications from '../hooks/useNotifications';
import { CURRENT_USER_NAME } from '../constants/home';
import { APPLICATION_STATS, USER_EMAIL, APP_VERSION } from '../constants/mypage';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const { bookmarkedIds } = useBookmarks();
  const { hasUnread } = useNotifications();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(
    () => () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    },
    [avatarUrl],
  );

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    e.target.value = '';
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
              onClick={() => fileInputRef.current.click()}
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

          <p className="mypage-name">{CURRENT_USER_NAME}</p>
        </div>

        <div className="mypage-stats">
          <div className="mypage-stat">
            <span className="mypage-stat-label">신청 완료</span>
            <span className="mypage-stat-value">{APPLICATION_STATS.completed}회</span>
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
          <h2 className="mypage-section-title">프로필</h2>
          <div className="mypage-card">
            <SettingsRow label="아이디" value={USER_EMAIL} />
            <SettingsRow
              label="비밀번호 변경"
              chevron
              onClick={() => navigate('/mypage/password')}
            />
            <SettingsRow label="이메일 변경" chevron onClick={() => navigate('/mypage/email')} />
          </div>
        </section>

        <section className="mypage-section">
          <h2 className="mypage-section-title">커뮤니티</h2>
          <div className="mypage-card">
            <SettingsRow label="내가 쓴 글" chevron />
            <SettingsRow label="내가 쓴 댓글" chevron />
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
    </div>
  );
}

export default MyPage;
