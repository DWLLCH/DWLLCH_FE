import apiClient from './client';

/* PATCH /auth/password */
export async function changePassword({ currentPassword, newPassword }) {
  const response = await apiClient.patch('/auth/password', { currentPassword, newPassword });
  return response.data;
}

export function changeEmail(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
}

export function changeUsername(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
}
