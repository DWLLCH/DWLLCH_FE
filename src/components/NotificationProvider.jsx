import { createContext, useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NOTIFICATIONS } from '../constants/notifications';

export const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const hasUnread = notifications.some((item) => !item.read);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, hasUnread, markAllAsRead }}>
      {children || <Outlet />}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
