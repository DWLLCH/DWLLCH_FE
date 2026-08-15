import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const BookmarkContext = createContext(null);

const MAX_BOOKMARK_COUNT = 20;
const STORAGE_KEY = 'bookmarked-policy-ids';

function readStoredBookmarkIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

function writeStoredBookmarkIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function BookmarkProvider({ children }) {
  const [bookmarkedIds, setBookmarkedIds] = useState(readStoredBookmarkIds);

  useEffect(() => {
    writeStoredBookmarkIds(bookmarkedIds);
  }, [bookmarkedIds]);

  const isBookmarked = (policyId) => bookmarkedIds.includes(policyId);

  const toggleBookmark = (policyId) => {
    let result = 'added';
    setBookmarkedIds((prev) => {
      if (prev.includes(policyId)) {
        result = 'removed';
        return prev.filter((id) => id !== policyId);
      }
      if (prev.length >= MAX_BOOKMARK_COUNT) {
        result = 'limit-reached';
        return prev;
      }
      return [...prev, policyId];
    });
    return result;
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedIds, isBookmarked, toggleBookmark, maxCount: MAX_BOOKMARK_COUNT }}
    >
      {children || <Outlet />}
    </BookmarkContext.Provider>
  );
}

export default BookmarkProvider;
