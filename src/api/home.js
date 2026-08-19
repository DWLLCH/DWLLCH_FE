import apiClient from './client';

/* GET /home/guest | 인증 불필요, bannerMessage와 popularPolicies를 반환 */
export async function getGuestHome() {
  const response = await apiClient.get('/home/guest');
  return response.data.data;
}

/* GET /home/curation | 인증 필요, AI 맞춤 정책 큐레이션(지역 매칭 + 조건 매칭) 반환 */
export async function getHomeCuration() {
  const response = await apiClient.get('/home/curation', { timeout: 35000 });
  return response.data.data;
}
