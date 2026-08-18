import apiClient from './client';

/* GET /community/boards/{boardType}/posts | 인증 불필요 */
export async function getPosts(boardType, page = 0) {
  const response = await apiClient.get(`/community/boards/${boardType}/posts`, {
    params: { page },
  });
  return response.data;
}

/* POST /community/boards/{boardType}/posts | 인증 필요 */
export async function createPost(
  boardType,
  { title, content, isAnonymous = false, allowNotification = true, images = [], poll } = {},
) {
  if (images.length > 0) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('isAnonymous', String(isAnonymous));
    formData.append('allowNotification', String(allowNotification));
    images.forEach((file) => formData.append('images', file));

    // Content-Type을 명시하면 axios/브라우저가 boundary를 못 붙이므로 헤더를 지워서
    // 브라우저가 자동으로 multipart boundary를 채우도록 함
    const response = await apiClient.post(`/community/boards/${boardType}/posts`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data.data;
  }

  const payload = { title, content, isAnonymous, allowNotification };
  if (poll) payload.poll = poll;

  const response = await apiClient.post(`/community/boards/${boardType}/posts`, payload);
  return response.data.data;
}

/* GET /community/posts/{postId}/comments | 인증 불필요, 댓글+대댓글을 평탄화된 배열로 반환 */
export async function getComments(postId) {
  const response = await apiClient.get(`/community/posts/${postId}/comments`);
  return response.data.data.comments;
}

/* POST /community/posts/{postId}/comments | 인증 필요, parentId를 같이 보내면 대댓글로 등록됨 */
export async function createComment(postId, { content, isAnonymous, parentId } = {}) {
  const payload = { content, isAnonymous };
  if (parentId) payload.parentId = parentId;
  const response = await apiClient.post(`/community/posts/${postId}/comments`, payload);
  return response.data.data;
}

/* PATCH /community/comments/{commentId} | 인증 필요, 본인 댓글만 수정 가능 */
export async function updateComment(commentId, { content, isAnonymous } = {}) {
  const payload = {};
  if (content !== undefined) payload.content = content;
  if (isAnonymous !== undefined) payload.isAnonymous = isAnonymous;
  const response = await apiClient.patch(`/community/comments/${commentId}`, payload);
  return response.data.data;
}

/* DELETE /community/comments/{commentId} | 인증 필요, 본인 댓글만 삭제 가능
   답글이 달린 댓글은 서버에서 소프트 삭제(내용만 "삭제된 댓글입니다"로 대체) 처리됨 */
export async function deleteComment(commentId) {
  await apiClient.delete(`/community/comments/${commentId}`);
}

/* POST /community/posts/{postId}/like | 인증 필요, 이미 좋아요한 경우 400 */
export async function likePost(postId) {
  const response = await apiClient.post(`/community/posts/${postId}/like`);
  return response.data.data;
}

/* DELETE /community/posts/{postId}/like | 인증 필요 */
export async function unlikePost(postId) {
  await apiClient.delete(`/community/posts/${postId}/like`);
}

/* POST /community/comments/{commentId}/like | 인증 필요, 이미 좋아요한 경우 400 */
export async function likeComment(commentId) {
  const response = await apiClient.post(`/community/comments/${commentId}/like`);
  return response.data.data;
}

/* DELETE /community/comments/{commentId}/like | 인증 필요 */
export async function unlikeComment(commentId) {
  await apiClient.delete(`/community/comments/${commentId}/like`);
}
