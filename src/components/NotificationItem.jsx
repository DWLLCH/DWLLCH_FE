import '../styles/NotificationItem.css';

function NotificationItem({ category, message, read }) {
  return (
    <li className={`notification-item${read ? '' : ' notification-item--unread'}`}>
      {!read && (
        <>
          <span className="notification-item-dot" aria-hidden="true" />
          <span className="notification-item-sr-only">읽지 않음</span>
        </>
      )}
      <p className="notification-item-category">{category}</p>
      <p className="notification-item-message">{message}</p>
    </li>
  );
}

export default NotificationItem;
