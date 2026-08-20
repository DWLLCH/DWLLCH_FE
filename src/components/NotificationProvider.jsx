import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken, getUserId } from '../api/auth';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/mypage';

export const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록, BookmarkProvider와 동일 패턴)
  const isLoggedIn = Boolean(getAccessToken());
  const userId = isLoggedIn ? getUserId() : null;

  const fetchedForRef = useRef(null);
  const sessionRef = useRef(userId);

  const fetchNotifications = useCallback(() => {
    const requestedFor = sessionRef.current;
    setLoading(true);
    getNotifications({ page: 0, size: 50 })
      .then((data) => {
        if (sessionRef.current !== requestedFor) return; // 세션이 바뀐 뒤 도착한 응답은 무시
        const items = (data.content || []).map((item) => ({
          id: item.id,
          message: item.message,
          type: item.type,
          targetId: item.targetId,
          read: item.isRead,
          createdAt: item.createdAt,
        }));
        setNotifications(items);
      })
      .catch(() => {
        // 알림 목록 조회 실패는 조용히 무시함 (다음 재조회 때 다시 시도)
      })
      .finally(() => {
        if (sessionRef.current === requestedFor) setLoading(false);
      });
  }, []);

  useEffect(() => {
    sessionRef.current = userId;

    if (fetchedForRef.current === userId) return;
    fetchedForRef.current = userId;

    if (userId) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const hasUnread = notifications.some((item) => !item.read);

  // 낙관적으로 먼저 로컬 상태를 바꾸고 서버에도 반영함, 실패해도 다음 재조회 때 실제 상태로 다시 맞춰지므로
  // 별도 롤백은 하지 않음(북마크처럼 서버 상태를 잘못 표시할 위험이 없는 단순 읽음 처리라 낙관적 갱신으로 충분함)
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === notificationId ? { ...item, read: true } : item)),
    );
    markNotificationRead(notificationId).catch(() => {
      // 조용히 무시 (다음 조회 때 실제 상태로 재동기화됨)
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    markAllNotificationsRead().catch(() => {
      // 조용히 무시 (다음 조회 때 실제 상태로 재동기화됨)
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        hasUnread,
        markAsRead,
        markAllAsRead,
        loading,
        refetch: fetchNotifications,
      }}
    >
      {children || <Outlet />}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
