import { createContext, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getUserId } from '../api/auth';

export const BlockContext = createContext(null);

const STORAGE_PREFIX = 'blocked-author-keys';

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}:${userId || 'guest'}`;
}

function readStoredBlockedKeys(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeStoredBlockedKeys(storageKey, keys) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

function BlockProvider({ children }) {
  const userId = getUserId();
  const storageKey = getStorageKey(userId);
  const storageKeyRef = useRef(storageKey);
  const [blockedKeys, setBlockedKeys] = useState(() => readStoredBlockedKeys(storageKey));

  useEffect(() => {
    if (storageKeyRef.current === storageKey) return;
    storageKeyRef.current = storageKey;
    setBlockedKeys(readStoredBlockedKeys(storageKey));
  }, [storageKey]);

  useEffect(() => {
    writeStoredBlockedKeys(storageKey, blockedKeys);
  }, [storageKey, blockedKeys]);

  const isAuthorBlocked = (authorKey) => {
    if (authorKey == null) return false;
    return blockedKeys.includes(String(authorKey));
  };

  const blockAuthor = (authorKey) => {
    if (authorKey == null) return;
    setBlockedKeys((prev) =>
      prev.includes(String(authorKey)) ? prev : [...prev, String(authorKey)],
    );
  };

  return (
    <BlockContext.Provider value={{ blockedKeys, isAuthorBlocked, blockAuthor }}>
      {children || <Outlet />}
    </BlockContext.Provider>
  );
}

export default BlockProvider;
