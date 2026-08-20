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

/* POST /chat/risk-check/sessions/{sessionId}/messages | 로그인 필요
   type은 'TEXT'|'IMAGE', TEXT는 content 필수, IMAGE는 file(이미지) 필수
   Gemini 분석까지 끝나고 나서 응답이 오는 동기 호출이라 시간이 걸릴 수 있어 timeout을 넉넉하게 잡음
   (getPolicyDetail·getBriefingDetail의 AI 호출부와 동일한 이유)
   응답 data: { messageId, assistantMessageId, riskLevel, analysisResult, actionGuide,
                externalAppLink, reply, suggestedReplies } */
export async function sendRiskCheckMessage(sessionId, { type, content = '', file } = {}) {
  if (file) {
    const formData = new FormData();
    formData.append('type', type);
    if (content) formData.append('content', content);
    formData.append('file', file);

    const response = await apiClient.post(
      `/chat/risk-check/sessions/${sessionId}/messages`,
      formData,
      { headers: { 'Content-Type': undefined }, timeout: 35000 },
    );
    return response.data.data;
  }

  const response = await apiClient.post(
    `/chat/risk-check/sessions/${sessionId}/messages`,
    { type, content },
    { timeout: 35000 },
  );
  return response.data.data;
}
