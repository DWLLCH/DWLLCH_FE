import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken } from '../api/auth';
import { getPolicyScraps, scrapPolicy, unscrapPolicy } from '../api/policy';

export const BookmarkContext = createContext(null);

const MAX_BOOKMARK_COUNT = 20;

function BookmarkProvider({ children }) {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(false);

  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록)
  const isLoggedIn = Boolean(getAccessToken());

  // 로그인 상태가 바뀔 때만 다시 불러오도록 하는 가드 (useFetchOnce와 동일한 패턴)
  const fetchedForRef = useRef(null);

  const fetchScraps = useCallback(() => {
    setLoading(true);
    getPolicyScraps({ page: 0, size: 50 })
      .then((data) => setScraps(data.content))
      .catch(() => {
        // 스크랩 목록 조회 실패는 조용히 무시함 (다음 재조회 때 다시 시도)
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (fetchedForRef.current === isLoggedIn) return;
    fetchedForRef.current = isLoggedIn;

    if (isLoggedIn) {
      fetchScraps();
    } else {
      setScraps([]);
    }
  }, [isLoggedIn, fetchScraps]);

  const bookmarkedIds = scraps.map((scrap) => scrap.policyId);

  const isBookmarked = (policyId) => bookmarkedIds.includes(policyId);

  const toggleBookmark = (policyId) => {
    if (!isLoggedIn) return 'login-required';

    const alreadyBookmarked = isBookmarked(policyId);

    if (!alreadyBookmarked && bookmarkedIds.length >= MAX_BOOKMARK_COUNT) {
      return 'limit-reached';
    }

    if (alreadyBookmarked) {
      const removed = scraps.find((scrap) => scrap.policyId === policyId);
      setScraps((prev) => prev.filter((scrap) => scrap.policyId !== policyId));
      unscrapPolicy(policyId).catch(() => {
        if (removed) setScraps((prev) => [removed, ...prev]);
        // eslint-disable-next-line no-alert
        alert('북마크 해제에 실패했어요');
      });
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
      });
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
