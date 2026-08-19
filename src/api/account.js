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

/* DELETE /auth/withdraw | 로그인 필요 (엔드포인트는 추정치, 연동 시 확인 필요) */
export async function withdrawAccount() {
  const response = await apiClient.delete('/auth/withdraw');
  return response.data;
}
