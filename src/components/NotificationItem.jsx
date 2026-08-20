import { formatRelativeTime } from '../utils/formatters';
import '../styles/NotificationItem.css';

function NotificationItem({ message, createdAt, read, onClick }) {
  return (
    <li className={`notification-item${read ? '' : ' notification-item--unread'}`}>
      {!read && (
        <>
          <span className="notification-item-dot" aria-hidden="true" />
          <span className="notification-item-sr-only">읽지 않음</span>
        </>
      )}
      <button type="button" className="notification-item-body" onClick={onClick}>
        {/* button 콘텐츠 모델은 phrasing content라 p(flow content)는 유효하지 않음, span + display: block으로 대체 */}
        <span className="notification-item-message">{message}</span>
        {createdAt && (
          <span className="notification-item-time">{formatRelativeTime(createdAt)}</span>
        )}
      </button>
    </li>
  );
}

export default NotificationItem;
