import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useNotifications from '../hooks/useNotifications';
import '../styles/NotificationList.css';

function resolveNotificationPath(type, targetId) {
  if (targetId == null) return null;
  if (type === 'COMMENT' || type === 'REPLY') return `/community/${targetId}`;
  if (type === 'DEADLINE') return `/support/${targetId}`;
  return null;
}

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
