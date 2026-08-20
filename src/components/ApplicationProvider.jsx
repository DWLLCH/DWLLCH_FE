import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAccessToken, getUserId } from '../api/auth';
import { createApplication, getApplications } from '../api/mypage';

export const ApplicationContext = createContext(null);

// BE Application 모델엔 신청일자 필드가 따로 없어서, 사용자가 고른 날짜를 memo에 이 접두사로 실어보냄
const APPLICATION_DATE_MEMO_PREFIX = '신청일자';
const APPLICATION_DATE_MEMO_PATTERN = /신청일자:\s*(\d{4}-\d{2}-\d{2})/;

// memo에서 날짜를 못 뽑으면(과거에 다른 방식으로 등록된 경우 등) createdAt으로 대체함
function extractAppliedDate(application) {
  const memoMatch = APPLICATION_DATE_MEMO_PATTERN.exec(application.memo || '');
  if (memoMatch) return memoMatch[1];

  const created = application.createdAt ? new Date(application.createdAt) : null;
  if (!created || Number.isNaN(created.getTime())) return null;

  const year = created.getFullYear();
  const month = String(created.getMonth() + 1).padStart(2, '0');
  const day = String(created.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ApplicationProvider({ children }) {
  // { [policyId]: { id, dateKey, status } } — 빠른 조회(신청 여부 확인)용
  const [applications, setApplications] = useState({});
  // 화면에 목록으로 그릴 때 씀, BE가 -created_at 순으로 내려주는 순서를 그대로 유지함
  // (applications는 policyId가 키라 숫자 키 특성상 정렬 순서가 뒤틀려서 목록 용도로는 못 씀)
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록, BookmarkProvider와 동일 패턴)
  const isLoggedIn = Boolean(getAccessToken());
  const userId = isLoggedIn ? getUserId() : null;

  const fetchedForRef = useRef(null);
  const sessionRef = useRef(userId);
  // 같은 정책에 중복 등록 요청이 겹치지 않도록 진행 중인 policyId를 추적
  const pendingRef = useRef(new Set());

  const fetchApplications = useCallback(() => {
    const requestedFor = sessionRef.current;
    setLoading(true);
    setError(false);
    getApplications({ page: 0, size: 50 })
      .then((data) => {
        if (sessionRef.current !== requestedFor) return; // 세션이 바뀐 뒤 도착한 응답은 무시
        const content = data.content || [];
        const next = {};
        const list = content.map((application) => {
          const dateKey = extractAppliedDate(application);
          next[application.policyId] = {
            id: application.id,
            dateKey,
            status: application.status,
          };
          return {
            id: application.id,
            policyId: application.policyId,
            policyTitle: application.policyTitle,
            status: application.status,
            dateKey,
          };
        });
        setApplications(next);
        setApplicationList(list);
      })
      .catch(() => {
        if (sessionRef.current !== requestedFor) return;
        // 조회 실패를 빈 목록으로 조용히 넘기면 재시도 경로가 없어서 계속 빈 상태로 보임
        // 에러 상태로 남겨두고 refetch로 다시 시도할 수 있게 함
        setError(true);
      })
      .finally(() => {
        if (sessionRef.current === requestedFor) setLoading(false);
      });
  }, []);

  useEffect(() => {
    sessionRef.current = userId;
    // 세션이 바뀌면 이전 사용자 기준으로 남아있던 진행 중 요청 마커도 같이 정리함
    pendingRef.current.clear();

    if (fetchedForRef.current === userId) return;
    fetchedForRef.current = userId;

    if (userId) {
      fetchApplications();
    } else {
      setApplications({});
      setApplicationList([]);
      setError(false);
    }
  }, [userId, fetchApplications]);

  const getAppliedDate = (policyId) => applications[policyId]?.dateKey || null;

  // 성공하면 'completed', 실패하면 'error', 비로그인이면 'login-required'를 반환함
  // (호출한 쪽에서 실패 토스트/로그인 모달을 알맞게 보여줄 수 있도록, toggleBookmark와 동일한 규칙)
  const completeApplication = (policyId, dateKey) => {
    // 클로저로 캡처된 값 대신 호출 시점 localStorage를 다시 확인함 (toggleBookmark와 동일한 이유)
    if (!getAccessToken()) return Promise.resolve('login-required');
    if (applications[policyId] || pendingRef.current.has(policyId)) {
      return Promise.resolve(undefined);
    }

    // 요청 시작 시점의 세션을 기억해뒀다가, 응답이 왔을 때도 같은 세션이어야만 상태에 반영함
    // (로그아웃/계정 전환 도중 응답이 오면 이전 사용자의 신청 건이 새 사용자 상태에 섞이는 걸 막음)
    const requestedFor = sessionRef.current;
    pendingRef.current.add(policyId);

    return createApplication({
      policyId,
      status: 'COMPLETED',
      memo: `${APPLICATION_DATE_MEMO_PREFIX}: ${dateKey}`,
    })
      .then((application) => {
        if (sessionRef.current !== requestedFor) return 'completed';

        setApplications((prev) => ({
          ...prev,
          [policyId]: {
            id: application.id,
            dateKey,
            status: application.status,
          },
        }));
        setApplicationList((prev) => [
          {
            id: application.id,
            policyId,
            policyTitle: application.policyTitle,
            status: application.status,
            dateKey,
          },
          ...prev,
        ]);
        return 'completed';
      })
      .catch(() => 'error')
      .finally(() => pendingRef.current.delete(policyId));
  };

  const appliedCount = Object.keys(applications).length;

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        applicationList,
        getAppliedDate,
        completeApplication,
        appliedCount,
        loading,
        error,
        refetch: fetchApplications,
      }}
    >
      {children || <Outlet />}
    </ApplicationContext.Provider>
  );
}

export default ApplicationProvider;
