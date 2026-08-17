import apiClient from './client';

/* GET /home/guest | 인증 불필요, bannerMessage와 popularPolicies를 반환 */
export async function getGuestHome() {
  const response = await apiClient.get('/home/guest');
  return response.data.data;
}
