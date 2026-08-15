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
      { id: 2, color: 'blue', icon: 'graph', title: '자립 준비 중인 청년 필수 금융 치트키' },
      { id: 3, color: 'red', icon: 'chart', title: '월세부터 신용점수까지' },
      {
        id: 4,
        color: 'blue',
        icon: 'pigbank',
        title: '갑자기 생긴 목돈, 어디부터 관리해야할까?',
      },
      { id: 5, color: 'green', icon: 'money', title: '대출받기 전 꼭 알아야하는 모든 것' },
      { id: 6, color: 'red', icon: 'idcard', title: '신용카드 만들기 전에 알아둘 것' },
    ],
  },
  {
    id: 'living',
    title: '주거 & 일상자립',
    description: '내가 사는 주거 공간, 꼭 필요한 정보만 모아뒀어요.',
    cards: [
      { id: 1, color: 'blue', icon: 'home', title: '부동산 계약 시 명심해야 할 3가지' },
      { id: 2, color: 'green', icon: 'heart', title: '일상자립, 국가가 곁에서 도와드려요' },
      { id: 3, color: 'blue', icon: 'document', title: '관리비, 어디까지 내야할까?' },
      { id: 4, color: 'green', icon: 'clock', title: '자취생이라면 꼭 알아야 할 생활 꿀팁' },
      { id: 5, color: 'blue', icon: 'letter', title: '집주인에게 이런 말을 들었다면?' },
      { id: 6, color: 'red', icon: 'graph', title: '전세와 월세, 나에게 맞는 집은?' },
    ],
  },
  {
    id: 'career',
    title: '취업 & 진로',
    description: '막막한 취업 및 진로 정보를 한눈에 알아봐요.',
    cards: [
      { id: 1, color: 'red', icon: 'graduation', title: '선배들이 알려주는 취업 꿀팁' },
      { id: 2, color: 'blue', icon: 'magnifier', title: '면접에서 자주 나오는 질문 모음' },
      { id: 3, color: 'green', icon: 'pigbank', title: '취업 전에 받을 수 있는 지원금' },
      { id: 4, color: 'blue', icon: 'document', title: '자립준비청년 취업 지원제도' },
      { id: 5, color: 'green', icon: 'money', title: '첫 월급, 어떻게 관리하면 좋을까?' },
      { id: 6, color: 'red', icon: 'letter', title: '이력서에 뭘 써야 할지 모르겠다면?' },
    ],
  },
];
