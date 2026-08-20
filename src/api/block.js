import apiClient from './client';

/* POST /users/blocks | 인증 필요, body: { targetUserId }
   자기 자신을 차단하거나 이미 차단한 사용자면 400, 이때 구체적인 사유는
   response.data.data.targetUserId에 문자열로 내려옴(예: "이미 차단한 사용자입니다.") */
export async function blockUser(targetUserId) {
  const response = await apiClient.post('/users/blocks', { targetUserId });
  return response.data.data;
}
