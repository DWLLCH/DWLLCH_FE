import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useNotifications from '../hooks/useNotifications';
import '../styles/NotificationList.css';

// targetId 의미가 type마다 다름, 지금 실제로 만들어지는 알림은 COMMENT뿐이라 target_id가 게시글 id임
// (REPLY도 같은 의미로 쓰일 예정, DEADLINE은 아직 실제로 내려오는 알림이 없어서 이동 경로 미정)
function resolveNotificationPath(type, targetId) {
  if (targetId == null) return null;
  if (type === 'COMMENT' || type === 'REPLY') return `/community/${targetId}`;
  return null;
}

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleBack = () => {
    markAllAsRead();
    navigate(-1);
  };

  const handleItemClick = (item) => {
    if (!item.read) markAsRead(item.id);
    const path = resolveNotificationPath(item.type, item.targetId);
    if (path) navigate(path);
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
