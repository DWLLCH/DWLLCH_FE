import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useNotifications from '../hooks/useNotifications';
import '../styles/NotificationList.css';

// targetId 의미가 type마다 다름, COMMENT/REPLY는 게시글 id(DEADLINE 등 다른 타입 이동 경로는 아직 미정)
function resolveNotificationPath(type, targetId) {
  if (targetId == null) return null;
  if (type === 'COMMENT' || type === 'REPLY') return `/community/${targetId}`;
  return null;
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
