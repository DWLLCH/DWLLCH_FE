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
  // { [policyId]: { id, dateKey } }
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(false);

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
    getApplications({ page: 0, size: 50 })
      .then((data) => {
        if (sessionRef.current !== requestedFor) return; // 세션이 바뀐 뒤 도착한 응답은 무시
        const next = {};
        (data.content || []).forEach((application) => {
          next[application.policyId] = {
            id: application.id,
            dateKey: extractAppliedDate(application),
          };
        });
        setApplications(next);
      })
      .catch(() => {
        // 신청 목록 조회 실패는 조용히 무시함 (다음 재조회 때 다시 시도)
      })
      .finally(() => {
        if (sessionRef.current === requestedFor) setLoading(false);
      });
  }, []);

  useEffect(() => {
    sessionRef.current = userId;

    if (fetchedForRef.current === userId) return;
    fetchedForRef.current = userId;

    if (userId) {
      fetchApplications();
    } else {
      setApplications({});
    }
  }, [userId, fetchApplications]);

  const getAppliedDate = (policyId) => applications[policyId]?.dateKey || null;

  // 성공하면 'completed', 실패하면 'error'를 반환함 (호출한 쪽에서 실패 토스트를 보여줄 수 있도록)
  const completeApplication = (policyId, dateKey) => {
    if (applications[policyId] || pendingRef.current.has(policyId)) {
      return Promise.resolve(undefined);
    }

    pendingRef.current.add(policyId);

    return createApplication({
      policyId,
      status: 'COMPLETED',
      memo: `${APPLICATION_DATE_MEMO_PREFIX}: ${dateKey}`,
    })
      .then((application) => {
        setApplications((prev) => ({
          ...prev,
          [policyId]: { id: application.id, dateKey },
        }));
        return 'completed';
      })
      .catch(() => 'error')
      .finally(() => pendingRef.current.delete(policyId));
  };

  const appliedCount = Object.keys(applications).length;

  return (
    <ApplicationContext.Provider
      value={{ applications, getAppliedDate, completeApplication, appliedCount, loading }}
    >
      {children || <Outlet />}
    </ApplicationContext.Provider>
  );
}

export default ApplicationProvider;
