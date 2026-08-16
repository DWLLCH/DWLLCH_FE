import { POSTS } from './community';
import { CURRENT_USER_NAME } from './home';

export const MY_POSTS = POSTS.slice(0, 5).map(({ badge, ...post }) => ({
  ...post,
  author: CURRENT_USER_NAME,
}));

export const MY_COMMENTS = [
  {
    id: 1,
    postId: 1,
    commentId: 1,
    postTitle: POSTS[0].title,
    commentText: '상담사님에게 어떤 질문을 드려야 할지 감이 안와요 ㅜㅠ',
    time: '8시간 전',
  },
  {
    id: 2,
    postId: 1,
    commentId: 3,
    postTitle: POSTS[0].title,
    commentText: '이런 꿀팁 글을~ 감사합니다',
    time: '8시간 전',
  },
  {
    id: 3,
    postId: 2,
    commentId: 1,
    postTitle: POSTS[1].title,
    commentText: '저도 비슷한 시기가 있었는데 지나고 보니 괜찮아지더라고요',
    time: '7시간 전',
  },
  {
    id: 4,
    postId: 3,
    commentId: 1,
    postTitle: POSTS[2].title,
    commentText: '부모님 서류는 저도 따로 냈던 것 같아요!',
    time: '5시간 전',
  },
  {
    id: 5,
    postId: 4,
    commentId: 1,
    postTitle: POSTS[3].title,
    commentText: '저는 반반 나눠서 썼어요',
    time: '5시간 전',
  },
];
