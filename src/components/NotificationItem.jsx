import '../styles/NotificationItem.css';

function NotificationItem({ category, message, read }) {
  return (
    <li className={`notification-item${read ? '' : ' notification-item--unread'}`}>
      {!read && <span className="notification-item-dot" />}
      <p className="notification-item-category">{category}</p>
      <p className="notification-item-message">{message}</p>
    </li>
  );
}

export default NotificationItem;
