import apiClient from './client';

/* GET /policies | 인증 불필요, 개인화 없이 전체 정책 목록 조회
   목록형 API라 공통 페이징 포맷({content, page, size, totalElements, totalPages, hasNext})을
   최상위로 바로 반환함 (success/data 래퍼 없음) */
export async function getPolicies({ category, keyword, page = 0, size = 20 } = {}) {
  const params = { page, size };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const response = await apiClient.get('/policies', { params });
  return response.data;
}

/* GET /policies/{policyId} | 인증 불필요
   success/data 래퍼가 있는 일반 API 포맷이라 response.data.data를 반환함 */
export async function getPolicyDetail(policyId) {
  const response = await apiClient.get(`/policies/${policyId}`);
  return response.data.data;
}
