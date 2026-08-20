import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken, getUserId } from '../api/auth';
import { getNotifications } from '../api/mypage';

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
    }
  }, [userId, fetchNotifications]);

  const hasUnread = notifications.some((item) => !item.read);

  // BE에 읽음 처리 API가 아직 없어서(mypage/urls.py에 GET만 있음) 서버에는 반영되지 않고
  // 화면을 벗어났다 다시 들어오면(재조회) 다시 안읽음 상태로 보일 수 있음
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, hasUnread, markAllAsRead, loading, refetch: fetchNotifications }}
    >
      {children || <Outlet />}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
