import blueBox from '../assets/blueBox.svg';
import greenBox from '../assets/greenBox.svg';
import redBox from '../assets/redBox.svg';
import chart from '../assets/briefing_icons/chart.svg';
import clock from '../assets/briefing_icons/clock.svg';
import computer from '../assets/briefing_icons/computer.svg';
import court from '../assets/briefing_icons/court.svg';
import delivery from '../assets/briefing_icons/delivery.svg';
import document from '../assets/briefing_icons/document.svg';
import graduation from '../assets/briefing_icons/graduation.svg';
import graph from '../assets/briefing_icons/graph.svg';
import heart from '../assets/briefing_icons/heart.svg';
import home from '../assets/briefing_icons/home.svg';
import idcard from '../assets/briefing_icons/idcard.svg';
import letter from '../assets/briefing_icons/letter.svg';
import magnifier from '../assets/briefing_icons/magnifier.svg';
import money from '../assets/briefing_icons/money.svg';
import phone from '../assets/briefing_icons/phone.svg';
import pigbank from '../assets/briefing_icons/pigbank.svg';

export const BRIEFING_ICONS = {
  chart,
  clock,
  computer,
  court,
  delivery,
  document,
  graduation,
  graph,
  heart,
  home,
  idcard,
  letter,
  magnifier,
  money,
  phone,
  pigbank,
};

export const BRIEFING_BOX_IMAGES = {
  blue: blueBox,
  green: greenBox,
  red: redBox,
};

/* 목록 조회 API(GET /briefings)는 category만 내려주고 색상/아이콘은 안 줘서
   기존 3개 고정 섹션(금융/주거/취업) 틀은 FE에서 유지하고 category로 그룹핑함 */
export const BRIEFING_SECTION_META = [
  {
    id: 'finance',
    category: 'FINANCE',
    title: '금융 & 경제',
    description: '어려운 금융 경제 영역, AI가 알기 쉽게 정리해뒀어요.',
  },
  {
    id: 'living',
    category: 'HOUSING',
    title: '주거 & 일상자립',
    description: '내가 사는 주거 공간, 꼭 필요한 정보만 모아뒀어요.',
  },
  {
    id: 'career',
    category: 'EMPLOYMENT',
    title: '취업 & 진로',
    description: '막막한 취업 및 진로 정보를 한눈에 알아봐요.',
  },
];

// 카드 색상/아이콘은 BE 응답에 없어서 섹션별로 기존 목데이터에 쓰던 조합을 그대로 순환 배정함
const CARD_VISUAL_ROTATION = {
  finance: [
    { color: 'green', icon: 'money' },
    { color: 'blue', icon: 'graph' },
    { color: 'red', icon: 'chart' },
    { color: 'blue', icon: 'pigbank' },
    { color: 'green', icon: 'money' },
    { color: 'red', icon: 'idcard' },
  ],
  living: [
    { color: 'blue', icon: 'home' },
    { color: 'green', icon: 'heart' },
    { color: 'blue', icon: 'document' },
    { color: 'green', icon: 'clock' },
    { color: 'blue', icon: 'letter' },
    { color: 'red', icon: 'graph' },
  ],
  career: [
    { color: 'red', icon: 'graduation' },
    { color: 'blue', icon: 'magnifier' },
    { color: 'green', icon: 'pigbank' },
    { color: 'blue', icon: 'document' },
    { color: 'green', icon: 'money' },
    { color: 'red', icon: 'letter' },
  ],
};

export function getCardVisual(sectionId, index) {
  const rotation = CARD_VISUAL_ROTATION[sectionId] || CARD_VISUAL_ROTATION.finance;
  return rotation[index % rotation.length];
}

export const BRIEFING_SECTIONS = [
  {
    id: 'finance',
    title: '금융 & 경제',
    description: '어려운 금융 경제 영역, AI가 알기 쉽게 정리해뒀어요.',
    cards: [
      {
        id: 1,
        color: 'green',
        icon: 'money',
        title: '자립정착금, 어떻게 써야 잘 썼다고 소문이 날까?',
      },
      {
        id: 2,
        color: 'blue',
        icon: 'graph',
        title: '자립 준비 중인 청년 필수 금융 치트키',
      },
      { id: 3, color: 'red', icon: 'chart', title: '월세부터 신용점수까지' },
      {
        id: 4,
        color: 'blue',
        icon: 'pigbank',
        title: '갑자기 생긴 목돈, 어디부터 관리해야할까?',
      },
      {
        id: 5,
        color: 'green',
        icon: 'money',
        title: '대출받기 전 꼭 알아야하는 모든 것',
      },
      {
        id: 6,
        color: 'red',
        icon: 'idcard',
        title: '신용카드 만들기 전에 알아둘 것',
      },
    ],
  },
  {
    id: 'living',
    title: '주거 & 일상자립',
    description: '내가 사는 주거 공간, 꼭 필요한 정보만 모아뒀어요.',
    cards: [
      {
        id: 1,
        color: 'blue',
        icon: 'home',
        title: '부동산 계약 시 명심해야 할 3가지',
      },
      {
        id: 2,
        color: 'green',
        icon: 'heart',
        title: '일상자립, 국가가 곁에서 도와드려요',
      },
      {
        id: 3,
        color: 'blue',
        icon: 'document',
        title: '관리비, 어디까지 내야할까?',
      },
      {
        id: 4,
        color: 'green',
        icon: 'clock',
        title: '자취생이라면 꼭 알아야 할 생활 꿀팁',
      },
      {
        id: 5,
        color: 'blue',
        icon: 'letter',
        title: '집주인에게 이런 말을 들었다면?',
      },
      {
        id: 6,
        color: 'red',
        icon: 'graph',
        title: '전세와 월세, 나에게 맞는 집은?',
      },
    ],
  },
  {
    id: 'career',
    title: '취업 & 진로',
    description: '막막한 취업 및 진로 정보를 한눈에 알아봐요.',
    cards: [
      {
        id: 1,
        color: 'red',
        icon: 'graduation',
        title: '선배들이 알려주는 취업 꿀팁',
      },
      {
        id: 2,
        color: 'blue',
        icon: 'magnifier',
        title: '면접에서 자주 나오는 질문 모음',
      },
      {
        id: 3,
        color: 'green',
        icon: 'pigbank',
        title: '취업 전에 받을 수 있는 지원금',
      },
      {
        id: 4,
        color: 'blue',
        icon: 'document',
        title: '자립준비청년 취업 지원제도',
      },
      {
        id: 5,
        color: 'green',
        icon: 'money',
        title: '첫 월급, 어떻게 관리하면 좋을까?',
      },
      {
        id: 6,
        color: 'red',
        icon: 'letter',
        title: '이력서에 뭘 써야 할지 모르겠다면?',
      },
    ],
  },
];

const BRIEFING_DETAILS = {
  'finance-2': {
    description: ['자립을 앞둔 청년이라면 꼭 알아야 할', '금융 정보만 모아봤어요'],
    summary: [
      '자립정착금은 목적에 맞게 계획적으로 사용하기',
      '신용관리, 처음부터 습관을 들이면 신용이 자산이 돼요',
      '정부와 지자체의 금융 지원 제도를 적극 활용하기',
      '금융사기 예방, 꼭 기억해야 할 3가지',
    ],
    sections: [
      {
        title: '초기 자산금 세팅 : 지원금 100% 활용법',
        description:
          '가장 먼저 손에 쥐게 되는 목돈과 매월 들어오는 지원금을 안전하게 굴리고 지키는 방법입니다',
        links: [
          '자립수당 & 자립 정착금 활용법 보기',
          '청년 특화 금융 상품 모아보기',
          '디딤 씨앗 통장 수령하는 법 보기',
        ],
      },
      {
        title: '텅장 방지! 통장 쪼개기 기술',
        table: {
          headers: ['통장 종류', '활용 목적', '치트키 (관리 팁)'],
          rows: [
            [
              '수입 통장',
              '모든 수입이 들어오고 고정 지출이 나가는 통장',
              '자동이체 날짜를 모두 통일하기',
            ],
            [
              '생활금 통장',
              '식비, 쇼핑 등 통제할 수 있는 변동 지출 관리',
              '한 달 예산 맞춰 이체 해두기',
            ],
            ['비상금 통장', '병원비 등 예상 못한 지출 대비용', '이자 높은 파킹통장 이용하기'],
          ],
        },
      },
    ],
    chatbotHint: '내 상황에 딱 맞는 금융 지원 제도가 궁금하다면?',
  },
};

function createDefaultDetail(section, card) {
  return {
    description: [section.description],
    summary: [
      `${card.title}, 핵심만 짚어봤어요`,
      '자립준비청년을 위한 실질적인 정보만 정리했어요',
      '더 자세한 내용은 AI 챗봇에게 물어볼 수 있어요',
    ],
    sections: [
      {
        title: card.title,
        description: '자세한 콘텐츠는 준비 중이에요. 곧 업데이트될 예정이에요.',
      },
    ],
    chatbotHint: '더 궁금한 점이 있다면?',
  };
}

export function getBriefingDetail(sectionId, cardId) {
  const section = BRIEFING_SECTIONS.find((item) => item.id === sectionId);
  const numericCardId = Number(cardId);
  const card = section?.cards.find((item) => item.id === numericCardId);
  if (!section || !card) return null;

  const detail =
    BRIEFING_DETAILS[`${sectionId}-${numericCardId}`] || createDefaultDetail(section, card);
  return { section, card, ...detail };
}
