import apiClient from './client';

/* GET /policies | 인증 불필요, 로그인 상태면 matchLevel/matchReason으로 AI 예상 적합도도 같이 내려줌
   sort: updatedAt(기본값) | applicationEnd */
export async function getPolicies({ category, keyword, sort, page = 0, size = 20 } = {}) {
  const params = { page, size };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;
  if (sort) params.sort = sort;

  const response = await apiClient.get('/policies', { params, timeout: 35000 });
  return response.data;
}

/* GET /policies/{policyId} | 인증 불필요
   success/data 래퍼가 있는 일반 API 포맷이라 response.data.data를 반환함 */
export async function getPolicyDetail(policyId) {
  const response = await apiClient.get(`/policies/${policyId}`);
  return response.data.data;
}

/* POST /policies/{policyId}/scrap | 로그인 필요
   success/data 래퍼가 있어서 response.data.data(생성된 스크랩 정보)를 반환함 */
export async function scrapPolicy(policyId) {
  const response = await apiClient.post(`/policies/${policyId}/scrap`);
  return response.data.data;
}

/* DELETE /policies/{policyId}/scrap | 로그인 필요, 성공 시 204 No Content */
export async function unscrapPolicy(policyId) {
  await apiClient.delete(`/policies/${policyId}/scrap`);
}

/* GET /policies/scraps | 로그인 필요, 페이징 (getPolicies와 동일한 응답 포맷) */
export async function getPolicyScraps({ page = 0, size = 20 } = {}) {
  const response = await apiClient.get('/policies/scraps', { params: { page, size } });
  return response.data;
}
