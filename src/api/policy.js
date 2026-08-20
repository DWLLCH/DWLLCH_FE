import apiClient from './client';

/* GET /policies | 인증 불필요, 로그인 상태면 matchLevel/matchReason으로 AI 예상 적합도도 같이 내려줌
   sort: updatedAt(기본값) | applicationEnd | scrapCount
   protectionType/ageRange/incomeCriteria는 콤마로 복수 값 전달 (같은 파라미터 내는 AND, 파라미터끼리는 OR) */
export async function getPolicies({
  category,
  keyword,
  sort,
  protectionType,
  ageRange,
  incomeCriteria,
  page = 0,
  size = 20,
} = {}) {
  const params = { page, size };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;
  if (sort) params.sort = sort;
  if (protectionType) params.protectionType = protectionType;
  if (ageRange) params.ageRange = ageRange;
  if (incomeCriteria) params.incomeCriteria = incomeCriteria;

  const response = await apiClient.get('/policies', { params, timeout: 35000 });
  return response.data;
}

/* GET /policies/{policyId} | 인증 불필요
   로그인 + 프로필 완성 상태면 matchLevel/matchReason 계산에 Gemini 호출이 들어가서
   BE 응답이 느릴 수 있어 timeout을 넉넉하게 잡음 (getPolicies와 동일한 이유)
   success/data 래퍼가 있는 일반 API 포맷이라 response.data.data를 반환함 */
export async function getPolicyDetail(policyId) {
  const response = await apiClient.get(`/policies/${policyId}`, { timeout: 35000 });
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

/* POST /policies/chatbot/query | 인증 불필요
   question은 최대 500자, policyId를 같이 보내면 해당 정책 정보 기준으로 답변함
   세션 개념 없이 질문 하나당 답변 하나를 바로 받는 단발성 호출
   응답 data: { answer, answerable } (answerable이 false면 정책 정보로 답할 수 없는 질문) */
export async function getPolicyChatbotAnswer(question, policyId) {
  const payload = { question };
  if (policyId) payload.policyId = policyId;

  const response = await apiClient.post('/policies/chatbot/query', payload, { timeout: 35000 });
  return response.data.data;
}
