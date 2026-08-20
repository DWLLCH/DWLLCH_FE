import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useNotifications from '../hooks/useNotifications';
import '../styles/NotificationList.css';

// targetId 의미가 type마다 다름, COMMENT/REPLY와 DEADLINE은 각각 게시글/정책 id
// PROTECTION_END는 target_id가 안 내려와서(BE mypage/notification_services.py) 이동 없이 정보성으로만 보여줌
function resolveNotificationPath(type, targetId) {
  if (targetId == null) return null;
  if (type === 'COMMENT' || type === 'REPLY') return `/community/${targetId}`;
  if (type === 'DEADLINE') return `/support/${targetId}`;
  return null;
}

// 알림 카드마다 각자 자기 구분(카테고리)을 보여줌(피그마 디자인 기준), 공용 섹션 헤더가 아니라
// NotificationItem 하나하나 안에 굵은 글씨로 들어감
const NOTIFICATION_CATEGORY_LABELS = {
  DEADLINE: '신청 마감 임박',
  COMMUNITY: '커뮤니티',
  PROTECTION_END: '회원 정보',
  ETC: '기타',
};

function resolveNotificationCategory(type) {
  if (type === 'COMMENT' || type === 'REPLY') return 'COMMUNITY';
  if (type === 'DEADLINE' || type === 'PROTECTION_END') return type;
  return 'ETC';
}

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead, refetch } = useNotifications();

  // NotificationProvider는 세션당 한 번만 자동으로 조회해서, 앱을 켜놓은 동안 새로 온 알림이
  // 있어도 새로고침 전엔 안 보였음 - 알림 탭에 들어올 때마다 다시 조회해서 최신 상태로 보여줌
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleBack = () => {
    markAllAsRead();
    navigate(-1);
  };

  const handleItemClick = (item) => {
    if (!item.read) markAsRead(item.id);
    const path = resolveNotificationPath(item.type, item.targetId);
    if (!path) return;
    // commentId가 있으면(댓글/대댓글 알림) PostDetail이 이 값으로 해당 댓글로 스크롤·하이라이트함
    // (MyComments.jsx가 댓글 클릭 시 이동하는 것과 동일한 패턴)
    navigate(path, item.commentId != null ? { state: { commentId: item.commentId } } : undefined);
  };

  return (
    <div className="notification-list-page">
      <header className="notification-list-header">
        <button
          type="button"
          className="notification-list-back"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>알림</h1>
      </header>

      <div className="notification-list-body">
        {loading ? (
          <div className="notification-list-empty">
            <LoadingSpinner />
          </div>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                category={NOTIFICATION_CATEGORY_LABELS[resolveNotificationCategory(item.type)]}
                message={item.message}
                createdAt={item.createdAt}
                read={item.read}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </ul>
        ) : (
          <div className="notification-list-empty">
            <p>아직 도착한 알림이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationList;
