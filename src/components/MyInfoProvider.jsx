import { createContext, useCallback, useEffect, useRef, useState } from 'react';
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
    // 온보딩 때 입력한 종료(예정)일은 상태와 무관하게 항상 유지합니다. (라벨만 화면 쪽에서 예정일/종료일로 분기)
    endDate: protectionEndDate,
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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 조회 화면(재시도 버튼)에서 다시 부를 수 있도록 fetch 로직을 함수로 분리했습니다.
  const fetchProfile = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return getMyProfile()
      .then((profile) => {
        if (!isMountedRef.current) return;
        setData(toViewData(profile));
      })
      .catch(() => {
        if (!isMountedRef.current) return;
        setError('프로필 정보를 불러오지 못했어요.');
      })
      .finally(() => {
        if (isMountedRef.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <MyInfoContext.Provider value={{ data, updateData, isLoading, error, refetch: fetchProfile }}>
      {children || <Outlet />}
    </MyInfoContext.Provider>
  );
}

export default MyInfoProvider;
