import apiClient from './client';

/* POST /chat/risk-check/sessions | 로그인 필요
   위기판독(전세사기 등 위험 상황) 세션을 새로 생성함, 호출할 때마다 새 세션이 만들어지므로
   이미 진행 중인 세션이 있으면 getRiskCheckSession으로 먼저 조회해서 재사용할 것 */
export async function createRiskCheckSession() {
  const response = await apiClient.post('/chat/risk-check/sessions');
  return response.data.data;
}

/* GET /chat/risk-check/sessions/{sessionId} | 로그인 필요
   세션 상태(latestRiskLevel 등)와 지금까지 주고받은 메시지 목록을 함께 내려줌
   본인 세션이 아니거나 존재하지 않으면 404 */
export async function getRiskCheckSession(sessionId) {
  const response = await apiClient.get(`/chat/risk-check/sessions/${sessionId}`);
  return response.data.data;
}
