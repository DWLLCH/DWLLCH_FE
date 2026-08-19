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
