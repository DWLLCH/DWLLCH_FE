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
  // markAsRead/markAllAsRead가 겹칠 때, 먼저 실패한 쪽의 재조회가 아직 안 끝난 다른 요청의
  // 이전 상태를 덮어써버리는 걸 막기 위한 진행 중 요청 카운터(모두 끝난 뒤 한 번만 재조회함)
  const pendingReadRequestsRef = useRef(0);
  const hasFailedReadRequestRef = useRef(false);

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

  // 진행 중이던 읽음 요청이 모두 끝난 뒤(개별/전체 읽음이 겹쳐도) 그중 하나라도 실패했을 때만
  // 한 번 재조회함, 아직 안 끝난 다른 요청의 이전 상태로 재조회 결과가 덮어써지는 걸 막기 위함
  const resolveReadRequest = useCallback(() => {
    pendingReadRequestsRef.current -= 1;
    if (pendingReadRequestsRef.current > 0) return;
    if (!hasFailedReadRequestRef.current) return;
    hasFailedReadRequestRef.current = false;
    fetchNotifications();
  }, [fetchNotifications]);

  // 낙관적으로 먼저 로컬 상태를 바꾸고 서버에도 반영함, 실패하면 로컬 상태만 읽음으로 남아있고
  // 서버는 그대로라 hasUnread 등이 실제와 어긋날 수 있어서 재조회로 다시 맞춤
  // (fetchNotifications 자체에 세션 일치 가드가 있어서 그 사이 로그아웃/계정 전환돼도 안전함)
  const markAsRead = useCallback(
    (notificationId) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, read: true } : item)),
      );
      pendingReadRequestsRef.current += 1;
      markNotificationRead(notificationId)
        .catch(() => {
          hasFailedReadRequestRef.current = true;
        })
        .finally(resolveReadRequest);
    },
    [resolveReadRequest],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    pendingReadRequestsRef.current += 1;
    markAllNotificationsRead()
      .catch(() => {
        hasFailedReadRequestRef.current = true;
      })
      .finally(resolveReadRequest);
  }, [resolveReadRequest]);

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
