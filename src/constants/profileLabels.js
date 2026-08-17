/* GET /mypage/profile가 내려주는 enum 코드를 화면에 보여줄 한글 라벨로 변환하는 매핑 테이블 */

const PROTECTION_TYPE_LABELS = {
  RESIDENTIAL_CARE: '아동양육시설',
  GROUP_HOME: '공동생활가정',
  FOSTER_CARE: '가정위탁',
  ETC: '기타',
  UNKNOWN: '잘 모르겠어요',
};

const HOUSING_TYPE_LABELS = {
  MONTHLY_RENT: '월세 (보증금과 월 임대료를 내고 있어요)',
  JEONSE: '전세 (전세보증금을 내고 살아요)',
  OWNED: '자가 (본인 소유의 집에서 살고 있어요)',
  FREE: '무상 거주 (가족이나 지인의 집에서 살고 있어요)',
  FACILITY: '시설·그룹홈 등',
};

const HOUSING_SITUATION_LABELS = {
  STABLE: '안정적으로 거주하고 있어요',
  MOVING: '이사할 집을 찾고 있어요',
  SEEKING_INDEPENDENCE: '독립할 집을 찾고 있어요',
  BURDEN: '주거비가 부담스러워요',
  PREPARING_END: '곧 보호종료라 주거를 준비해야 해요',
  UNKNOWN: '아직 잘 모르겠어요',
};

const LIVING_STATUS_LABELS = {
  SCHOOL: '학교에 다니고 있어요',
  EMPLOYED: '직장에 다니고 있어요',
  PART_TIME: '아르바이트·파트타임으로 일하고 있어요',
  FREELANCE: '프리랜서·플랫폼 노동을 하고 있어요',
  SELF_EMPLOYED: '자영업·창업을 하고 있어요',
  JOB_SEEKING: '취업을 준비하고 있어요',
  NONE: '현재 하고 있는 일이 없어요',
};

const INCOME_TYPE_LABELS = {
  EARNED: '근로소득 (직장, 아르바이트, 파트타임 등)',
  BUSINESS: '사업소득 (프리랜서, 자영업, 플랫폼 노동 등)',
  OTHER_ASSET: '기타·재산소득 (이자, 임대소득 등)',
  NONE: '현재 소득이 없어요 (미취업, 취업준비 등)',
};

const SUPPORT_TYPE_LABELS = {
  SETTLEMENT_FUND: '자립정착금',
  EMPLOYMENT_SUPPORT: '취업 지원',
  INDEPENDENCE_ALLOWANCE: '자립수당',
  LIVING_SUPPORT: '생활비 지원',
  HOUSING_SUPPORT: '주거지원',
  FINANCIAL_SUPPORT: '금융 지원',
  EDUCATION_SUPPORT: '교육·장학 지원',
  ETC: '기타',
  UNKNOWN: '잘 모르겠어요',
  NONE: '현재 받고 있는 지원이 없어요',
};

const NEEDED_HELP_LABELS = {
  HOUSING: '주거 (집을 구하거나 주거비 지원이 필요해요)',
  FINANCE: '금융·생활비 (돈 관리나 생활비 지원이 필요해요)',
  EMPLOYMENT: '취업·진로 (일자리나 진로 정보가 필요해요)',
  EDUCATION: '교육 (학업이나 교육비 지원이 필요해요)',
  POLICY_INFO: '지원제도 (내가 받을 수 있는 지원을 찾고 싶어요)',
  ADMIN_DOCS: '행정·서류 (신청이나 서류 준비가 어려워요)',
  COUNSELING: '상담·도움 (누군가에게 상담을 받고 싶어요)',
};

function mapLabel(map, code) {
  return map[code] || code || '';
}

function mapLabels(map, codes) {
  return (codes || []).map((code) => mapLabel(map, code));
}

export const toProtectionTypeLabel = (code) => mapLabel(PROTECTION_TYPE_LABELS, code);
export const toHousingTypeLabel = (code) => mapLabel(HOUSING_TYPE_LABELS, code);
export const toHousingSituationLabel = (code) => mapLabel(HOUSING_SITUATION_LABELS, code);
export const toLivingStatusLabels = (codes) => mapLabels(LIVING_STATUS_LABELS, codes);
export const toIncomeTypeLabel = (code) => mapLabel(INCOME_TYPE_LABELS, code);
export const toSupportReceivedLabels = (codes) => mapLabels(SUPPORT_TYPE_LABELS, codes);
export const toNeededHelpLabels = (codes) => mapLabels(NEEDED_HELP_LABELS, codes);

function buildReverseMap(map) {
  return Object.fromEntries(Object.entries(map).map(([code, label]) => [label, code]));
}

const REVERSE_PROTECTION_TYPE = buildReverseMap(PROTECTION_TYPE_LABELS);
const REVERSE_HOUSING_TYPE = buildReverseMap(HOUSING_TYPE_LABELS);
const REVERSE_HOUSING_SITUATION = buildReverseMap(HOUSING_SITUATION_LABELS);
const REVERSE_LIVING_STATUS = buildReverseMap(LIVING_STATUS_LABELS);
const REVERSE_INCOME_TYPE = buildReverseMap(INCOME_TYPE_LABELS);
const REVERSE_SUPPORT_TYPE = buildReverseMap(SUPPORT_TYPE_LABELS);
const REVERSE_NEEDED_HELP = buildReverseMap(NEEDED_HELP_LABELS);

function reverseLabel(reverseMap, label) {
  return reverseMap[label];
}

function reverseLabels(reverseMap, labels) {
  return (labels || []).map((label) => reverseLabel(reverseMap, label)).filter(Boolean);
}

export const fromProtectionTypeLabel = (label) => reverseLabel(REVERSE_PROTECTION_TYPE, label);
export const fromHousingTypeLabel = (label) => reverseLabel(REVERSE_HOUSING_TYPE, label);
export const fromHousingSituationLabel = (label) => reverseLabel(REVERSE_HOUSING_SITUATION, label);
export const fromLivingStatusLabels = (labels) => reverseLabels(REVERSE_LIVING_STATUS, labels);
export const fromIncomeTypeLabel = (label) => reverseLabel(REVERSE_INCOME_TYPE, label);
export const fromSupportReceivedLabels = (labels) => reverseLabels(REVERSE_SUPPORT_TYPE, labels);
export const fromNeededHelpLabels = (labels) => reverseLabels(REVERSE_NEEDED_HELP, labels);
