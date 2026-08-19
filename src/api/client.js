import axios from 'axios';

/*
 * 백엔드 config/urls.py를 보면 실제로는 "/api/v1" 접두사가 붙어있지 않습니다.
 * (API 명세서 공통 규격 문서에는 http://localhost:8000/api/v1 이라고 되어있지만
 *  실제 코드는 path("", include("users.urls")) 로 접두사 없이 바로 연결되어 있음)
 * 그래서 baseURL은 접두사 없이 http://localhost:8000 으로 두고,
 * 각 API 호출에서 "/auth/login" 처럼 명세서에 나온 경로를 그대로 사용합니다.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000, // 10초 안에 응답 없으면 타임아웃 처리 (서버가 죽었을 때 무한 대기 방지)
  headers: {
    'Content-Type': 'application/json',
  },
});

const ACCESS_TOKEN_KEY = 'dwllch_accessToken';
const REFRESH_TOKEN_KEY = 'dwllch_refreshToken';
const USER_ID_KEY = 'dwllch_userId';

// 로그인 없이도 볼 수 있는(AllowAny) 화면들 — 만료된 토큰을 들고 있으면
// DRF가 permission_classes(AllowAny)보다 JWTAuthentication을 먼저 검사해서
// 비로그인도 접근 가능해야 할 화면인데도 401이 나는 문제가 있어 별도로 처리함
const PUBLIC_PATH_PATTERNS = [/^\/policies$/, /^\/policies\/\d+$/, /^\/home\/guest$/];

function isPublicPath(url) {
  if (!url) return false;
  const path = url.split('?')[0];
  return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* reissue access token */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isReissueRequest = originalRequest?.url?.includes('/auth/reissue');

    // 401이 아니거나, 재발급 요청 자체가 401난 것이거나, 이미 한 번 재시도한 요청이면 그냥 실패 처리
    if (status !== 401 || isReissueRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 공개 화면인데 만료된 토큰 때문에 401 난 경우, 토큰만 떼고 비로그인 요청으로 재시도함
    const retryAsGuest = () => {
      originalRequest._retry = true;
      delete originalRequest.headers.Authorization;
      return apiClient(originalRequest);
    };

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      if (isPublicPath(originalRequest.url)) {
        // 재요청 시 request 인터셉터가 localStorage의 만료된 토큰을 다시 붙이지 않도록 먼저 지움
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return retryAsGuest();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await apiClient.post('/auth/reissue', { refreshToken });
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
      return apiClient(originalRequest);
    } catch (reissueError) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);

      if (isPublicPath(originalRequest.url)) return retryAsGuest();

      window.location.href = '/login';
      return Promise.reject(reissueError);
    }
  },
);

export default apiClient;
