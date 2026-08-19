export const FILTER_GROUPS = [
  {
    title: '보호 유형 (출신)',
    options: ['아동양육시설', '공동생활가정', '가정위탁'],
  },
  {
    title: '나이 / 연령',
    options: ['만 18세 미만', '만 18세 ~ 만 24세', '만 25세 ~ 만 34세'],
  },
  {
    title: '소득 기준',
    options: ['기초생활수급자', '기준 중위소득', '차상위계층'],
  },
];

export const SORT_OPTIONS = ['AI 추천순', '최근 업데이트 순', '신청 마감 빠른 순', '인기순'];

/* AI 추천순은 BE 파라미터가 아직 없어서 매핑에서 제외 (선택 시 BE 기본값인 updatedAt으로 조회됨) */
export const SORT_VALUE_MAP = {
  '최근 업데이트 순': 'updatedAt',
  '신청 마감 빠른 순': 'applicationEnd',
  인기순: 'scrapCount',
};

export const AI_SORT_INFO = {
  title: 'AI 추천순이란?',
  description:
    '입력하신 정보를 바탕으로 나의 상황과 정책의 자격요건을 비교해 적합도가 높은 정책부터 보여드려요.',
  criteriaTitle: '추천에 반영되는 정보',
  criteria: '연령 · 지역 · 소득 · 주거/취업 상황 · 정책 자격요건',
  note: '※ 추천 결과는 참고용이며, 실제 신청 가능 여부는 해당 기관의 공고를 확인해주세요.',
};
