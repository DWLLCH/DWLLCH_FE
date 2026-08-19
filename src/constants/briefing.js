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

// 상세 히어로 아이콘도 BE 응답에 없어서 섹션 대표 아이콘(순환 배열의 첫 번째)으로 임시 표시함
export function getSectionDefaultIcon(sectionId) {
  const rotation = CARD_VISUAL_ROTATION[sectionId] || CARD_VISUAL_ROTATION.finance;
  return rotation[0].icon;
}

// content는 "#"/"##"(상위 번호 섹션)와 "###"(상위 섹션에 속한 하위 링크 항목) 2단계
// 마크다운 헤딩 구조로 내려오는 단일 텍스트임
// 상위 섹션 { title, body, subItems } 배열로 변환하고, ### 하위 항목은 subItems에 { title, body }로 묶어 넣음
// 상위 섹션 title 앞에 붙은 "1. " 같은 번호는 떼어냄 (DetailSection의 번호 아이콘이 이미 표시하므로 중복 방지)
// 헤딩이 하나도 없으면 전체를 제목 없는 섹션 하나로 반환함
function stripLeadingNumber(text) {
  return text.replace(/^\d+\.\s*/, '').trim();
}

export function parseBriefingContent(content) {
  if (!content) return [];

  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentSubItem = null;

  const closeSubItem = () => {
    if (currentSubItem && currentSection) {
      currentSection.subItems.push({ ...currentSubItem, body: currentSubItem.body.trim() });
    }
    currentSubItem = null;
  };

  const closeSection = () => {
    closeSubItem();
    if (currentSection) sections.push({ ...currentSection, body: currentSection.body.trim() });
    currentSection = null;
  };

  lines.forEach((line) => {
    const level3Match = line.match(/^###\s+(.*)$/);
    const level2Match = !level3Match && line.match(/^##\s+(.*)$/);
    const level1Match = !level3Match && !level2Match && line.match(/^#\s+(.*)$/);

    if (level2Match || level1Match) {
      closeSection();
      currentSection = {
        title: stripLeadingNumber((level2Match || level1Match)[1]),
        body: '',
        subItems: [],
      };
    } else if (level3Match) {
      closeSubItem();
      if (!currentSection) currentSection = { title: '', body: '', subItems: [] };
      currentSubItem = { title: level3Match[1].trim(), body: '' };
    } else if (currentSubItem) {
      currentSubItem.body += `${line}\n`;
    } else {
      if (!currentSection) currentSection = { title: '', body: '', subItems: [] };
      currentSection.body += `${line}\n`;
    }
  });
  closeSection();

  return sections.filter((section) => section.title || section.body || section.subItems.length > 0);
}
