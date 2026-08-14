import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const DocumentChecklistContext = createContext(null);

function DocumentChecklistProvider({ children }) {
  const [checkedByPolicy, setCheckedByPolicy] = useState({});

  const getChecked = (policyId, documents) =>
    checkedByPolicy[policyId] || documents.map((doc) => doc.checked);

  const toggleChecked = (policyId, documents, index) => {
    setCheckedByPolicy((prev) => {
      const current = prev[policyId] || documents.map((doc) => doc.checked);
      const next = current.map((checked, i) => (i === index ? !checked : checked));
      return { ...prev, [policyId]: next };
    });
  };

  return (
    <DocumentChecklistContext.Provider value={{ getChecked, toggleChecked }}>
      {children || <Outlet />}
    </DocumentChecklistContext.Provider>
  );
}

export default DocumentChecklistProvider;
