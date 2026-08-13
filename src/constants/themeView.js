import file from '../assets/file.svg';
import money from '../assets/money.svg';
import chat from '../assets/chat.svg';

export const THEME_ICONS = { file, money, chat };

export const THEME_GROUPS = [
  {
    id: 'region',
    color: 'blue',
    badgeLabel: '지역 맞춤',
    title: '박하은님의 주거지역에 딱맞는 제도',
    cards: [
      {
        id: 1,
        icon: 'file',
        title: '자립지원 사업비 / 충남 인구정책과',
        description:
          '보호 종료 5년 이내 자립준비청년 자립수준평가 등 기본 사후관리 및 맞춤형 자립지원통합서비스 제공',
      },
      {
        id: 2,
        icon: 'money',
        title: '자립준비청년 지원 / 충남 인구정책과',
        description: '자립수당 : 자립준비청년에게 자립수당 (1인 월 50만원, 최대 60개월) 지원',
      },
    ],
  },
  {
    id: 'condition',
    color: 'green',
    badgeLabel: '조건 맞춤',
    title: '박하은님의 조건에 딱맞는 제도',
    cards: [
      {
        id: 3,
        icon: 'money',
        title: '자립준비청년 자립수당 지급 / 중앙부처',
        description: '자립수당 결정 대상자 명의 계좌로 매월 50만원 지급',
      },
      {
        id: 4,
        icon: 'chat',
        title: '자립준비청년 자립수당지원 / 보건복지부',
        description:
          '보호대상아동의 자립준비 역량 강화 및 보호종료 후 자립준비청년의 안정적인 사회적응과 자립실현',
      },
    ],
  },
];
