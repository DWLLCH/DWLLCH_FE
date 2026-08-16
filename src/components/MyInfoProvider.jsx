import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getMyProfile } from '../api/mypage';
import {
  toProtectionTypeLabel,
  toHousingTypeLabel,
  toHousingSituationLabel,
  toLivingStatusLabels,
  toIncomeTypeLabel,
  toSupportReceivedLabels,
  toNeededHelpLabels,
} from '../constants/profileLabels';

export const MyInfoContext = createContext(null);

const emptyData = {
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
  currentSupports: [],
  supportNeeds: [],
};

/* 백엔드 GET /mypage/profile 응답(enum 코드)을 화면에서 쓰는 한글 라벨 형태로 변환합니다. */
function toViewData(profile) {
  // 백엔드는 birthDate를 "YYYY-MM-DD"로 내려주는데, formatBirthDate 유틸은 "YYYYMMDD" 숫자만 받습니다.
  const birthDate = profile.birthDate ? profile.birthDate.replaceAll('-', '') : '';
  const protectionEndDate = profile.protectionEndDate ? new Date(profile.protectionEndDate) : null;
  // 보호종료 상태는 별도 필드가 없어 protectionEndDate와 오늘 날짜를 비교해 추정합니다.
  // (보호 중 / 보호 종료 2단계로 운영하기로 확정 — MyInfoEdit.jsx의 END_STATUSES와 동일한 문구)
  const isEnded = Boolean(protectionEndDate && protectionEndDate <= new Date());
  const endStatus = isEnded ? '보호 종료했어요' : '아직 보호 중이에요';

  return {
    birthDate,
    sido: profile.region?.sido || '',
    sigungu: profile.region?.sigungu || '',
    protectionType: toProtectionTypeLabel(profile.protectionType),
    endStatus,
    // 아직 보호 중이면 종료일을 null로 둬서, 조회/수정 화면 모두에서 "보호 종료일" 행이 안 보이게 합니다.
    // (MyInfoEdit.jsx가 상태를 '아직 보호 중이에요'로 바꿀 때 endDate를 null로 지우는 것과 동일한 규칙)
    endDate: isEnded ? protectionEndDate : null,
    housing: toHousingTypeLabel(profile.housingType),
    housingSituation: toHousingSituationLabel(profile.housingSituation),
    lifestyle: toLivingStatusLabels(profile.livingStatus),
    incomeType: toIncomeTypeLabel(profile.incomeType),
    currentSupports: toSupportReceivedLabels(profile.supportReceived),
    supportNeeds: toNeededHelpLabels(profile.neededHelp),
  };
}

function MyInfoProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMyProfile()
      .then((profile) => {
        if (!isMounted) return;
        setData(toViewData(profile));
      })
      .catch(() => {
        if (!isMounted) return;
        setError('프로필 정보를 불러오지 못했어요.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <MyInfoContext.Provider value={{ data, updateData, isLoading, error }}>
      {children || <Outlet />}
    </MyInfoContext.Provider>
  );
}

export default MyInfoProvider;
