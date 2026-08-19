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
