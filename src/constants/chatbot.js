export const CHATBOT_NAME = 'AI 챗봇';

export const MAX_ATTACH_COUNT = 5;

export const MENU_OPTIONS = [
  { value: 'ask-policy', label: '제도 관련 질문이 있어요' },
  { value: 'recommend-criteria', label: '제도 추천 기준이 뭔가요?' },
];

export const RENT_GUIDE_OPTIONS = [
  { value: 'yes', label: '예' },
  { value: 'no', label: '아니오' },
];

export const BACK_TO_MENU_OPTION = [{ value: 'back-to-menu', label: '메뉴로 돌아가기' }];

export const ATTACH_REGISTRY_OPTION = [{ value: 'attach-registry', label: '등기부등본 첨부하기' }];

export const RISK_CHECK_STRUCTURE_VALUE = 'risk-check-structure';

export const STRUCTURE_REQUEST_OPTION = [
  { value: RISK_CHECK_STRUCTURE_VALUE, label: '지금까지 상황 정리해줘' },
];

export const RISK_GRADE_LABELS = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
  CRITICAL: '긴급',
};

// BE(RiskCheckStructureView) 응답의 structuredReport 안 필드는 camelCase
export const STRUCTURED_REPORT_FIELDS = [
  { key: 'date', label: '날짜' },
  { key: 'amount', label: '금액' },
  { key: 'location', label: '장소' },
  { key: 'counterpart', label: '상대방' },
  { key: 'situationSummary', label: '상황 요약' },
  { key: 'riskType', label: '위험 유형' },
];

// missingFields 배열 안 값은 BE(StructuredReportResult) pydantic 필드명 그대로라 snake_case
export const MISSING_FIELD_LABELS = {
  date: '날짜',
  amount: '금액',
  location: '장소',
  counterpart: '상대방',
  situation_summary: '상황 요약',
  risk_type: '위험 유형',
};

// 상황 정리 카드 뒤에 붙는 조력자 연계 칩, 클릭 자체를 동의(consent)로 간주해서 바로 연계 요청함
export const RISK_CHECK_CONNECT_PREFIX = 'risk-check-connect:';

export const CONNECT_TARGET_OPTIONS = [
  { value: `${RISK_CHECK_CONNECT_PREFIX}SUPPORT_STAFF`, label: '조력자 연결해줘' },
  { value: `${RISK_CHECK_CONNECT_PREFIX}COUNSELOR`, label: '상담사 연결해줘' },
  { value: `${RISK_CHECK_CONNECT_PREFIX}EMERGENCY`, label: '긴급 지원 연결해줘' },
];

// BE(SupportConnection.ConnectTo) 값 그대로 키로 씀
export const CONNECT_TARGET_LABELS = {
  SUPPORT_STAFF: '조력자',
  COUNSELOR: '상담사',
  EMERGENCY: '긴급 지원',
};

// username은 로그인한 회원의 실제 이름(예: 박하은), 아직 못 불러왔거나 비로그인이면 회원으로 대체함
export function getGreetingText(username) {
  const name = username ? `${username}님` : '회원님';
  return `안녕하세요! ${name}.\n저는 ${name}의 궁금증을 해결해줄 도우미, AI 챗봇이에요.\n24시간 언제든지 답변해드릴게요.`;
}

export const INITIAL_MESSAGES = [
  {
    id: 'greeting',
    sender: 'bot',
    text: getGreetingText(),
  },
  {
    id: 'menu',
    sender: 'bot',
    title: '무엇이 궁금하신가요?',
    quickReplies: MENU_OPTIONS,
  },
];

const DEPOSIT_KEYWORDS = ['정착금', '보증금', '가전', '가구'];

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function getBotReply({ optionValue, freeText }) {
  if (freeText && includesAny(freeText, DEPOSIT_KEYWORDS)) {
    return [
      {
        sender: 'bot',
        text: '정착금 수령을 축하드려요! 1,000만 원은 자립 초기에 정말 중요한 자산이에요.\n보통 70~80%는 보증금, 20~30%는 필수 가전·가구 및 생활 준비금으로 나누는 걸 추천해 드려요.',
      },
      {
        sender: 'bot',
        text: '혹시 희망하시는 지역의 월세 시세나, LH/SH 임대주택 지원도 함께 알아보고 계신가요?',
        quickReplies: RENT_GUIDE_OPTIONS,
      },
    ];
  }

  if (optionValue === 'yes') {
    return [
      {
        sender: 'bot',
        title: '(집의 매매 시세) > (선순위 근저당 금액 + 내 보증금)',
        text: '집값보다 대출금과 내 보증금을 합친 금액이 더 크다면 경매로 넘어갔을 때 보증금을 돌려받지 못할 수 있어요.\n등기부등본에 적힌 채권최고액과 보증금 금액을 알려주시면, 안전한 비율인지 제가 바로 계산해 드릴게요.',
        quickReplies: [...ATTACH_REGISTRY_OPTION, ...BACK_TO_MENU_OPTION],
      },
    ];
  }

  if (optionValue === 'no') {
    return [
      {
        sender: 'bot',
        text: '알겠습니다! 필요하실 때 언제든 다시 물어봐주세요 🙂',
        quickReplies: BACK_TO_MENU_OPTION,
      },
    ];
  }

  if (optionValue === 'report-error') {
    return [
      {
        sender: 'bot',
        text: '알려주셔서 감사해요! 어떤 정보에 오류가 있었는지 자세히 입력해주시면 담당자 확인 후 빠르게 수정할게요.',
        quickReplies: BACK_TO_MENU_OPTION,
      },
    ];
  }

  if (optionValue === 'recommend-criteria') {
    return [
      {
        sender: 'bot',
        text: '연령, 거주지역, 보호종료 시기, 소득·주거 상황 등 회원님이 입력해주신 정보를 바탕으로 신청 가능성이 높은 제도부터 추천해 드려요.',
        quickReplies: BACK_TO_MENU_OPTION,
      },
    ];
  }

  if (optionValue === 'manual-input') {
    return [
      {
        sender: 'bot',
        text: '궁금하신 내용을 자유롭게 입력해주세요!',
      },
    ];
  }

  if (optionValue === 'ask-policy') {
    return [
      {
        sender: 'bot',
        text: '어떤 제도가 궁금하신가요? 편하게 질문을 입력해주세요!',
      },
    ];
  }

  if (optionValue === 'back-to-menu') {
    return [
      {
        sender: 'bot',
        title: '무엇이 궁금하신가요?',
        quickReplies: MENU_OPTIONS,
      },
    ];
  }

  if (optionValue === 'attach-registry') {
    return [
      {
        sender: 'bot',
        text: '아래 첨부 버튼을 눌러 등기부등본 사진이나 파일을 보내주세요.',
        quickReplies: BACK_TO_MENU_OPTION,
      },
    ];
  }

  return [
    {
      sender: 'bot',
      text: '아직 학습 중이라 정확한 답변을 드리기 어려워요. 다른 방식으로 질문해보시겠어요?',
      quickReplies: BACK_TO_MENU_OPTION,
    },
  ];
}

export function getAttachmentReply() {
  return [
    {
      sender: 'bot',
      text: '파일 확인했어요! 안전한 보증금 비율인지 검토 후 바로 안내해 드릴게요.',
      quickReplies: BACK_TO_MENU_OPTION,
    },
  ];
}
