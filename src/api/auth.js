import apiClient from './client';

/* 테스트용 -> 이메일에 "test" 들어가면 중복으로 뜨는 임시 목업 */
export function checkEmailDuplicate(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ available: !email.includes('test') });
    }, 300);
  });
}

const ACCESS_TOKEN_KEY = 'dwllch_accessToken';
const REFRESH_TOKEN_KEY = 'dwllch_refreshToken';
const USER_ID_KEY = 'dwllch_userId';

export function setTokens({ accessToken, refreshToken, userId }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (userId !== undefined && userId !== null) {
    localStorage.setItem(USER_ID_KEY, userId);
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

/* POST /auth/login */
export async function login({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data.data;
}
