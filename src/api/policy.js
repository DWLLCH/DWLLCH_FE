import apiClient from './client';

/* GET /policies | 인증 불필요, 로그인 상태면 matchLevel/matchReason으로 AI 예상 적합도도 같이 내려줌 */
export async function getPolicies({ category, keyword, page = 0, size = 20 } = {}) {
  const params = { page, size };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const response = await apiClient.get('/policies', { params, timeout: 35000 });
  return response.data;
}

/* GET /policies/{policyId} | 인증 불필요
   success/data 래퍼가 있는 일반 API 포맷이라 response.data.data를 반환함 */
export async function getPolicyDetail(policyId) {
  const response = await apiClient.get(`/policies/${policyId}`);
  return response.data.data;
}
