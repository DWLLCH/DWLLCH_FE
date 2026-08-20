import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken, getUserId } from '../api/auth';
import { getPolicyScraps, scrapPolicy, unscrapPolicy } from '../api/policy';

export const BookmarkContext = createContext(null);

const MAX_BOOKMARK_COUNT = 20;

function BookmarkProvider({ children }) {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(false);

  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록)
  const isLoggedIn = Boolean(getAccessToken());
  // 로그인 여부뿐 아니라 계정이 바뀌는 경우까지 감지하기 위한 세션 식별자
  const userId = isLoggedIn ? getUserId() : null;

  // 세션이 바뀔 때만 다시 불러오도록 하는 가드 (useFetchOnce와 동일한 패턴)
  const fetchedForRef = useRef(null);
  // fetchScraps 응답이 늦게 와도 그 사이 세션이 바뀌었으면 무시하기 위한 최신 세션 참조
  const sessionRef = useRef(userId);
  // 정책별로 스크랩 등록/해제 요청이 겹치지 않도록 진행 중인 policyId를 추적
  const pendingRef = useRef(new Set());

  const fetchScraps = useCallback(() => {
    const requestedFor = sessionRef.current;
    setLoading(true);
    getPolicyScraps({ page: 0, size: 50 })
      .then((data) => {
        if (sessionRef.current !== requestedFor) return; // 세션이 바뀐 뒤 도착한 응답은 무시
        setScraps(data.content);
      })
      .catch(() => {
        // 스크랩 목록 조회 실패는 조용히 무시함 (다음 재조회 때 다시 시도)
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
      fetchScraps();
    } else {
      setScraps([]);
    }
  }, [userId, fetchScraps]);

  const bookmarkedIds = scraps.map((scrap) => scrap.policyId);

  const isBookmarked = (policyId) => bookmarkedIds.includes(policyId);

  const toggleBookmark = (policyId) => {
    // 클로저로 캡처된 isLoggedIn(마지막 렌더 시점 값) 대신 클릭 시점 localStorage를 다시 확인함
    // BookmarkProvider가 리렌더되지 않은 사이에 토큰이 바뀌면 isLoggedIn이 실제 상태와 어긋날 수 있음
    if (!getAccessToken()) return 'login-required';
    if (pendingRef.current.has(policyId)) return undefined; // 이전 요청이 끝날 때까지 대기

    const alreadyBookmarked = isBookmarked(policyId);

    if (!alreadyBookmarked && bookmarkedIds.length >= MAX_BOOKMARK_COUNT) {
      return 'limit-reached';
    }

    pendingRef.current.add(policyId);

    if (alreadyBookmarked) {
      const removed = scraps.find((scrap) => scrap.policyId === policyId);
      setScraps((prev) => prev.filter((scrap) => scrap.policyId !== policyId));
      unscrapPolicy(policyId)
        .catch(() => {
          if (removed) setScraps((prev) => [removed, ...prev]);
          // eslint-disable-next-line no-alert
          alert('북마크 해제에 실패했어요');
        })
        .finally(() => pendingRef.current.delete(policyId));
      return 'removed';
    }

    // 낙관적으로 먼저 목록에 넣어서 아이콘은 바로 바뀌게 하고, 응답이 오면 실제 정책 정보로 교체함
    setScraps((prev) => [{ policyId }, ...prev]);
    scrapPolicy(policyId)
      .then((scrap) => {
        setScraps((prev) => prev.map((item) => (item.policyId === policyId ? scrap : item)));
      })
      .catch(() => {
        setScraps((prev) => prev.filter((item) => item.policyId !== policyId));
        // eslint-disable-next-line no-alert
        alert('북마크 등록에 실패했어요');
      })
      .finally(() => pendingRef.current.delete(policyId));
    return 'added';
  };

  return (
    <BookmarkContext.Provider
      value={{
        scraps,
        bookmarkedIds,
        isBookmarked,
        toggleBookmark,
        maxCount: MAX_BOOKMARK_COUNT,
        loading,
        refetch: fetchScraps,
      }}
    >
      {children || <Outlet />}
    </BookmarkContext.Provider>
  );
}

export default BookmarkProvider;
