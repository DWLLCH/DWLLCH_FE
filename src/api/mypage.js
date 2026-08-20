import apiClient from './client';

/* GET /mypage/profile | 인증 필요 (Authorization 헤더는 client.js 인터셉터가 자동으로 실어줌) */
export async function getMyProfile() {
  const response = await apiClient.get('/mypage/profile');
  return response.data.data;
}

/* PATCH /mypage/profile | 인증 필요 */
export async function updateMyProfile(payload) {
  const response = await apiClient.patch('/mypage/profile', payload);
  return response.data.data;
}

/* POST /mypage/profile | 인증 필요, 온보딩 자립 프로필 최초 등록 (이미 등록되어 있으면 409) */
export async function createMyProfile(payload) {
  const response = await apiClient.post('/mypage/profile', payload);
  return response.data.data;
}

/* GET /mypage/applications | 인증 필요, 페이징 (getPolicyScraps와 동일한 응답 포맷) */
export async function getApplications({ page = 0, size = 50 } = {}) {
  const response = await apiClient.get('/mypage/applications', { params: { page, size } });
  return response.data;
}

/* POST /mypage/applications | 인증 필요
   status는 'PLANNED'|'IN_PROGRESS'|'COMPLETED'|'REJECTED', Application 모델에 신청일자 필드가 따로 없어서
   사용자가 고른 날짜는 memo에 같이 실어보냄 (ApplicationProvider의 extractAppliedDate가 다시 꺼내 씀)
   응답 data: { id, policyId, policyTitle, status, memo, createdAt, updatedAt } */
export async function createApplication({ policyId, status = 'COMPLETED', memo = '' } = {}) {
  const response = await apiClient.post('/mypage/applications', {
    policy: policyId,
    status,
    memo,
  });
  return response.data.data;
}

/* GET /mypage/notifications | 인증 필요, 페이징 (getPolicyScraps와 동일한 응답 포맷)
   응답 항목: { id, message, isRead, createdAt } — 알림 종류/이동 대상 필드는 아직 BE에 없어서
   NotificationItem은 메시지 본문과 시간만 보여줌, 읽음 처리 API도 아직 없어서 markAllAsRead는 로컬 상태로만 동작함 */
export async function getNotifications({ page = 0, size = 50 } = {}) {
  const response = await apiClient.get('/mypage/notifications', { params: { page, size } });
  return response.data;
}
