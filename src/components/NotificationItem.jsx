import { formatRelativeTime } from '../utils/formatters';
import '../styles/NotificationItem.css';

function NotificationItem({ message, createdAt, read }) {
  return (
    <li className={`notification-item${read ? '' : ' notification-item--unread'}`}>
      {!read && (
        <>
          <span className="notification-item-dot" aria-hidden="true" />
          <span className="notification-item-sr-only">읽지 않음</span>
        </>
      )}
      <p className="notification-item-message">{message}</p>
      {createdAt && <p className="notification-item-time">{formatRelativeTime(createdAt)}</p>}
    </li>
  );
}

export default NotificationItem;
