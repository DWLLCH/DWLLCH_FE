import { createContext, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getUserId } from '../api/auth';

export const ApplicationContext = createContext(null);

const STORAGE_PREFIX = 'applied-policy-dates';

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}:${userId || 'guest'}`;
}

function readStoredApplications(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredApplications(storageKey, applications) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(applications));
  } catch {
    // ignore
  }
}

function ApplicationProvider({ children }) {
  const userId = getUserId();
  const storageKey = getStorageKey(userId);
  const storageKeyRef = useRef(storageKey);
  const [applications, setApplications] = useState(() => readStoredApplications(storageKey));

  useEffect(() => {
    if (storageKeyRef.current === storageKey) return;
    storageKeyRef.current = storageKey;
    setApplications(readStoredApplications(storageKey));
  }, [storageKey]);

  useEffect(() => {
    writeStoredApplications(storageKey, applications);
  }, [storageKey, applications]);

  const getAppliedDate = (policyId) => applications[policyId] || null;

  const completeApplication = (policyId, dateKey) => {
    setApplications((prev) => ({ ...prev, [policyId]: dateKey }));
  };

  const appliedCount = Object.keys(applications).length;

  return (
    <ApplicationContext.Provider
      value={{ applications, getAppliedDate, completeApplication, appliedCount }}
    >
      {children || <Outlet />}
    </ApplicationContext.Provider>
  );
}

export default ApplicationProvider;
