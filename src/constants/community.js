import postThumbSample from '../assets/post_thumb_sample.svg';

export const CATEGORIES = ['최신', '꿀팁', '고민', '자유'];

export const POST_CATEGORIES = ['꿀팁', '고민', '자유'];

// 프론트 탭/카테고리 한글 라벨 <-> 백엔드 boardType 코드
// latest_post_list 라우팅 백엔드에 확인 요청함 (수정후 각주 삭제)
export const BOARD_TYPE_TO_LABEL = { LATEST: '최신', TIP: '꿀팁', WORRY: '고민', FREE: '자유' };
export const LABEL_TO_BOARD_TYPE = { 최신: 'LATEST', 꿀팁: 'TIP', 고민: 'WORRY', 자유: 'FREE' };

export const REPORT_REASONS = [
  { value: 'SPAM', label: '스팸, 광고' },
  { value: 'SEXUAL', label: '음란성, 선정성 글' },
  { value: 'HATE', label: '혐오, 반응 조장 발언' },
  { value: 'PRIVACY', label: '개인정보 노출' },
  { value: 'FAKE_NEWS', label: '의도적인 거짓 정보 확산' },
];

export const NOTICE_POST = {
  id: 8,
  badge: 'notice',
  title: '커뮤니티 이용 안내 및 수칙',
  description:
    '주민등록번호, 계좌번호, 전화번호, 정확한 거주지 주소 등 개인정보는 절대 남기지 말아주세요.',
  author: '게시판 지킴이',
  time: '5일 전',
  createdAt: '2026-08-10T09:00:00',
  viewCount: 1204,
  likeCount: 12,
  content: [
    '주민등록번호, 계좌번호, 전화번호, 정확한 거주지 주소 등 개인정보는 절대 남기지 말아주세요.',
    '서로를 존중하는 따뜻한 커뮤니티를 만들어주세요.',
    '허위 정보, 비방, 광고성 글은 사전 안내 없이 삭제될 수 있습니다.',
  ],
  comments: [],
};

export const POSTS = [
  {
    id: 1,
    category: '꿀팁',
    badge: 'hot',
    title: '국민취업지원제도 1유형 신청 후기 & 팁',
    description:
      '이번에 1유형 선정돼서 구직촉진수당 받는 중인데 상담사님이 알려주신 꿀팁 공유해요.',
    author: '영차영차 123',
    time: '8시간 전',
    createdAt: '2026-08-15T01:00:00',
    viewCount: 3026,
    likeCount: 23,
    content: [
      '안녕하세요! 이번에 국민취업지원제도(국취제) 1유형에 선정되어서 구직촉진수당 받아가며 취업 준비 중인 청년입니다.',
      '처음 신청할 때는 서류 준비나 상담사님과의 대면 면담 과정이 살짝 막막했었는데요, 막상 진행해 보니 혼자 취준할 때보다 훨씬 든든하고 체계적이더라고요. 저처럼 처음 준비하시는 분들께 도움이 될까 싶어 질문을 받아보려 합니다.',
      '댓글에 궁금하신 거 적어주시면 최대한 빨리 답변 드릴게요.',
    ],
    comments: [
      {
        id: 1,
        author: '익명 1',
        createdAt: '2026-08-15T08:50:00',
        text: '상담사님에게 어떤 질문을 드려야 할지 감이 안와요 ㅜㅠ',
        likeCount: 1,
        replies: [
          {
            id: 1,
            author: '익명(글쓴이)',
            createdAt: '2026-08-15T08:51:00',
            text: '먼저 물어봐야 하거나 고민이 되는 항목을 메모에 정리해보는게 좋아요! 그 다음에는 상담사님께 편하게 여쭤보시면 답변해주실 거예요.',
            likeCount: 1,
          },
        ],
      },
      {
        id: 2,
        author: '익명 2',
        createdAt: '2026-08-15T08:52:00',
        text: '전반적으로 사업에 만족하시나여',
        likeCount: 2,
        replies: [
          {
            id: 1,
            author: '익명(글쓴이)',
            createdAt: '2026-08-15T08:53:00',
            text: '네 확실히 이전보다 취업 준비가 수월해진 느낌이에요!',
            likeCount: 1,
          },
          {
            id: 2,
            author: '익명 4',
            createdAt: '2026-08-15T08:55:00',
            text: '저도 신청해볼까 고민되네요',
            likeCount: 0,
          },
        ],
      },
      {
        id: 3,
        author: '익명 3',
        createdAt: '2026-08-15T08:57:00',
        text: '이런 꿀팁 글을~ 감사합니다',
        likeCount: 2,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    category: '고민',
    badge: 'hot',
    title: '주변에 의지할 어른이 없다는 게',
    description: '진심 서럽네요 ㅜㅜ',
    author: '게시판 지킴이',
    time: '7시간 전',
    createdAt: '2026-08-15T02:00:00',
    viewCount: 512,
    likeCount: 8,
    content: ['진심 서럽네요 ㅜㅜ'],
    comments: [
      {
        id: 1,
        author: '박하은',
        createdAt: '2026-08-15T02:30:00',
        text: '저도 비슷한 시기가 있었는데 지나고 보니 괜찮아지더라고요',
        likeCount: 0,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    category: '고민',
    title: 'LH 매입임대 서류 준비 중인데 이거 맞아?',
    description: '주민등록등본이랑 자격확인서 뗐는데, 부모님 관련 서류도 따로 제출해야 하나요?',
    author: 'vntlzp0127',
    time: '5시간 전',
    createdAt: '2026-08-15T04:00:00',
    viewCount: 234,
    likeCount: 3,
    content: ['주민등록등본이랑 자격확인서 뗐는데, 부모님 관련 서류도 따로 제출해야 하나요?'],
    comments: [
      {
        id: 1,
        author: '박하은',
        createdAt: '2026-08-15T04:30:00',
        text: '부모님 서류는 저도 따로 냈던 것 같아요!',
        likeCount: 0,
        replies: [],
      },
    ],
  },
  {
    id: 4,
    category: '고민',
    title: '자립정착금 나오면 보통 보증금으로 다 넣나요?',
    description:
      '정착금 수령 예정인데 보증금에 다 넣어야 할지 전/가구 살 돈을 좀 남길지 고민이에요.',
    author: 'goindingo13',
    time: '5시간 전',
    createdAt: '2026-08-15T04:10:00',
    viewCount: 198,
    likeCount: 4,
    content: ['정착금 수령 예정인데 보증금에 다 넣어야 할지 전/가구 살 돈을 좀 남길지 고민이에요.'],
    comments: [
      {
        id: 1,
        author: '박하은',
        createdAt: '2026-08-15T04:40:00',
        text: '저는 반반 나눠서 썼어요',
        likeCount: 0,
        replies: [],
      },
    ],
  },
  {
    id: 5,
    category: '꿀팁',
    title: '월세 계약할 때 특약사항에 이거 꼭 넣으세요!',
    description:
      "오늘 집 계약하고 왔는데 '입주 전 하자는 집주인이 수리해준다'는 특약 꼭 넣으라고 하시더라고요.",
    author: 'Haeun512',
    time: '16시간 전',
    createdAt: '2026-08-14T17:00:00',
    viewCount: 876,
    likeCount: 15,
    images: [postThumbSample, postThumbSample],
    content: [
      "오늘 집 계약하고 왔는데 '입주 전 하자는 집주인이 수리해준다'는 특약 꼭 넣으라고 하시더라고요.",
      '덕분에 마음 편하게 계약할 수 있었어요. 다들 계약하실 때 참고하세요!',
    ],
    comments: [],
  },
  {
    id: 6,
    category: '자유',
    title: '혼자 자취하니까 공과금 생각보다 많이 나오네',
    description: '매달 나가는 돈이 생각보다 많아서 깜짝 놀랐어요.',
    author: 'sunny8080',
    time: '2일 전',
    createdAt: '2026-08-13T09:00:00',
    viewCount: 143,
    likeCount: 6,
    content: ['매달 나가는 돈이 생각보다 많아서 깜짝 놀랐어요.'],
    comments: [],
  },
  {
    id: 7,
    category: '고민',
    title: '아는 형이 자꾸 계약서 보내주는데',
    description: '믿어도 되는 거 맞는지 봐줄사람?',
    author: 'lisa3357',
    time: '2일 전',
    createdAt: '2026-08-13T08:00:00',
    viewCount: 289,
    likeCount: 5,
    images: [postThumbSample],
    content: ['믿어도 되는 거 맞는지 봐줄사람?'],
    comments: [],
  },
];
