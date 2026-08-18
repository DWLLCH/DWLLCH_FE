import apiClient from './client';

/* GET /community/boards/{boardType}/posts | 인증 불필요
   LATEST(최신)는 특정 게시판 목록이 아니라 전체 게시글 목록이라 백엔드가 별도 엔드포인트
   (GET /community/posts, latest_post_list)로 분리해둬서 그쪽으로 보냄 */
export async function getPosts(boardType, page = 0) {
  const url = boardType === 'LATEST' ? '/community/posts' : `/community/boards/${boardType}/posts`;
  const response = await apiClient.get(url, {
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
    if (poll) formData.append('poll', JSON.stringify(poll));

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

/* GET /community/posts/{postId} | 인증 불필요, 조회할 때마다 viewCount 1 증가 */
export async function getPost(postId) {
  const response = await apiClient.get(`/community/posts/${postId}`);
  return response.data.data;
}

/* DELETE /community/posts/{postId} | 인증 필요, 본인 게시글만 삭제 가능 */
export async function deletePost(postId) {
  await apiClient.delete(`/community/posts/${postId}`);
}

/* PATCH /community/posts/{postId} | 인증 필요, 본인 게시글만 수정 가능 */
export async function updatePost(postId, { title, content, allowNotification, poll } = {}) {
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (content !== undefined) payload.content = content;
  if (allowNotification !== undefined) payload.allowNotification = allowNotification;
  if (poll !== undefined) payload.poll = poll;

  const response = await apiClient.patch(`/community/posts/${postId}`, payload);
  return response.data.data;
}

/* POST /community/posts/{postId}/poll/vote | 인증 필요, optionIds는 선택한 선택지 id 배열 */
export async function votePoll(postId, optionIds) {
  const response = await apiClient.post(`/community/posts/${postId}/poll/vote`, {
    optionIds,
  });
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

/* DELETE /community/comments/{commentId} | 인증 필요, 본인 댓글만 삭제 가능 */
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
