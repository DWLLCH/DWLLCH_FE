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

/* PATCH /mypage/profile/image | 인증 필요, multipart/form-data
   BE에 이미지 삭제 엔드포인트는 없음(mypage/views.py 기준) - "기본 이미지로 변경"은 FE 로컬에서만 처리함
   응답 data: { profileImage: <절대경로 URL> } */
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append('profileImage', file);
  const response = await apiClient.patch('/mypage/profile/image', formData, {
    headers: { 'Content-Type': undefined },
  });
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
   응답 항목: { id, message, type, targetId, commentId, isRead, createdAt }
   type은 DEADLINE/COMMENT/REPLY/ETC, targetId는 type마다 의미가 다름(COMMENT/REPLY는 게시글 id)
   commentId는 COMMENT/REPLY일 때만 값이 오고, 스크롤/하이라이트 대상 댓글(REPLY는 새로 달린 답글 자신) id임 */
export async function getNotifications({ page = 0, size = 50 } = {}) {
  const response = await apiClient.get('/mypage/notifications', { params: { page, size } });
  return response.data;
}

/* PATCH /mypage/notifications/{notificationId}/read | 인증 필요 */
export async function markNotificationRead(notificationId) {
  const response = await apiClient.patch(`/mypage/notifications/${notificationId}/read`);
  return response.data.data;
}

/* PATCH /mypage/notifications/read-all | 인증 필요, 응답 data: { updatedCount } */
export async function markAllNotificationsRead() {
  const response = await apiClient.patch('/mypage/notifications/read-all');
  return response.data.data;
}
