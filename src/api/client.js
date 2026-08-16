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

export default apiClient;
