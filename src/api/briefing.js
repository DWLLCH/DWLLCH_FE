import apiClient from './client';

/* GET /briefings | 로그인 필요
   category 필터 없으면 전체 카테고리, user.needed_help 기반 우선순위로 이미 정렬돼서 옴 */
export async function getBriefings({ category, page = 0, size = 100 } = {}) {
  const params = { page, size };
  if (category) params.category = category;

  const response = await apiClient.get('/briefings', { params });
  return response.data;
}

/* GET /briefings/{briefingId} | 로그인 필요
   keySummary는 캐시가 없으면 Gemini 호출이 들어가서 느릴 수 있어 timeout을 넉넉하게 잡음 (getPolicyDetail과 동일한 이유)
   success/data 래퍼가 있는 일반 API 포맷이라 response.data.data를 반환함 */
export async function getBriefingDetail(briefingId) {
  const response = await apiClient.get(`/briefings/${briefingId}`, { timeout: 35000 });
  return response.data.data;
}
