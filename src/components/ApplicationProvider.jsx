import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const ApplicationContext = createContext(null);

const STORAGE_KEY = 'applied-policy-dates';

function readStoredApplications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredApplications(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch {
    // ignore
  }
}

function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(readStoredApplications);

  useEffect(() => {
    writeStoredApplications(applications);
  }, [applications]);

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
