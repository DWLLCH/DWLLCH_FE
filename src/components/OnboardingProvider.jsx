import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const OnboardingContext = createContext(null);

const initialData = {
  birthDate: '',
  sido: '',
  sigungu: '',
  protectionType: '',
  endStatus: '',
  endDate: null,
  housing: '',
  housingSituation: '',
  lifestyle: [],
  incomeType: '',
};

function OnboardingProvider({ children }) {
  const [data, setData] = useState(initialData);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children || <Outlet />}
    </OnboardingContext.Provider>
  );
}

export default OnboardingProvider;
