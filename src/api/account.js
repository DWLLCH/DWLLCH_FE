import apiClient from './client';

/* PATCH /auth/password */
export async function changePassword({ currentPassword, newPassword }) {
  const response = await apiClient.patch('/auth/password', { currentPassword, newPassword });
  return response.data;
}

/* PATCH /auth/email */
export async function changeEmail({ currentPassword, newEmail }) {
  const response = await apiClient.patch('/auth/email', { currentPassword, newEmail });
  return response.data;
}

export function changeUsername(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
}

/* DELETE /auth/account | 로그인 필요, AccountDeleteSerializer가 password를 필수로 받음
   (reason은 선택 필드라 안 보내도 됨), 비밀번호가 틀리면 AUTH_400_CURRENT_PASSWORD_MISMATCH */
export async function withdrawAccount({ password, reason } = {}) {
  const payload = { password };
  if (reason) payload.reason = reason;
  const response = await apiClient.delete('/auth/account', { data: payload });
  return response.data;
}
