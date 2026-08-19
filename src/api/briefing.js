import apiClient from './client';

/* GET /briefings | 로그인 필요
   category 필터 없으면 전체 카테고리, user.needed_help 기반 우선순위로 이미 정렬돼서 옴 */
export async function getBriefings({ category, page = 0, size = 100 } = {}) {
  const params = { page, size };
  if (category) params.category = category;

  const response = await apiClient.get('/briefings', { params });
  return response.data;
}

export function waitForAiBriefing(delay = 3200) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
