import postThumbSample from '../assets/post_thumb_sample.svg';

export const CATEGORIES = ['최신', '꿀팁', '고민', '자유'];

export const NOTICE_POST = {
  id: 'notice-1',
  badge: 'notice',
  title: '커뮤니티 이용 안내 및 수칙',
  description:
    '주민등록번호, 계좌번호, 전화번호, 정확한 거주지 주소 등 개인정보는 절대 남기지 말아주세요.',
  author: '게시판 지킴이',
  time: '5일 전',
};

export const POSTS = [
  {
    id: 1,
    category: '꿀팁',
    badge: 'hot',
    title: '국민취업지원제도 1유형 신청 후기 & 팁',
    description:
      '이번에 1유형 선정돼서 구직촉진수당 받는 중인데 상담사님이 알려주신 꿀팁 공유해요.',
    author: '게시판 지킴이',
    time: '8시간 전',
    createdAt: '2026-08-15T01:00:00',
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
  },
  {
    id: 3,
    category: '고민',
    title: 'LH 매입임대 서류 준비 중인데 이거 맞아?',
    description: '주민등록등본이랑 자격확인서 뗐는데, 부모님 관련 서류도 따로 제출해야 하나요?',
    author: 'vntlzp0127',
    time: '5시간 전',
    createdAt: '2026-08-15T04:00:00',
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
    thumbnail: postThumbSample,
  },
  {
    id: 6,
    category: '자유',
    title: '혼자 자취하니까 공과금 생각보다 많이 나오네',
    description: '매달 나가는 돈이 생각보다 많아서 깜짝 놀랐어요.',
    author: 'sunny8080',
    time: '2일 전',
    createdAt: '2026-08-13T09:00:00',
  },
  {
    id: 7,
    category: '고민',
    title: '아는 형이 자꾸 계약서 보내주는데',
    description: '믿어도 되는 거 맞는지 봐줄사람?',
    author: 'lisa3357',
    time: '2일 전',
    createdAt: '2026-08-13T08:00:00',
    thumbnail: postThumbSample,
  },
];
