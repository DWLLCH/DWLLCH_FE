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

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
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
      window.location.href = '/login';
      return Promise.reject(reissueError);
    }
  },
);

export default apiClient;
