import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import NotificationItem from '../components/NotificationItem';
import useNotifications from '../hooks/useNotifications';
import '../styles/NotificationList.css';

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, markAllAsRead } = useNotifications();

  const handleBack = () => {
    markAllAsRead();
    navigate(-1);
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
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                category={item.category}
                message={item.message}
                read={item.read}
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
