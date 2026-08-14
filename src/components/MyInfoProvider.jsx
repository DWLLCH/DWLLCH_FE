import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const MyInfoContext = createContext(null);

const initialData = {
  birthDate: '20050312',
  sido: '서울특별시',
  sigungu: '강남구',
  protectionType: '아동양육시설',
  endStatus: '보호 종료했어요',
  endDate: new Date(2024, 2, 15),
  housing: '월세 (보증금과 월 임대료를 내고 있어요)',
  housingSituation: '안정적으로 거주하고 있어요',
  lifestyle: ['직장에 다니고 있어요'],
  incomeType: '근로소득 (직장, 아르바이트, 파트타임 등)',
  currentSupports: ['자립정착금', '주거지원'],
  supportNeeds: [
    '주거 (집을 구하거나 주거비 지원이 필요해요)',
    '금융·생활비 (돈 관리나 생활비 지원이 필요해요)',
  ],
};

function MyInfoProvider({ children }) {
  const [data, setData] = useState(initialData);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <MyInfoContext.Provider value={{ data, updateData }}>
      {children || <Outlet />}
    </MyInfoContext.Provider>
  );
}

export default MyInfoProvider;
