const DEFAULT_DETAIL = {
  disclaimer: '최종 지원 대상 여부는 해당 기관의 심사 결과에 따라 달라질 수 있습니다.',
  summary: '사업요약 : 자립준비청년을 위한 다양한 생활 안정 지원을 제공하는 사업이에요.',
  supportInfo: [
    { label: '지원 내용', value: '생활 안정 지원' },
    { label: '지원 금액', value: '기관 문의' },
    { label: '신청 기간', value: '상시 모집' },
  ],
  eligibility: [{ text: '자립준비청년 또는 가정 밖 청소년', status: 'met' }],
  applyPeriod: '상시 모집',
  applyMethod: {
    before: '해당 기관 홈페이지에서 신청할 수 있어요.',
    after: '',
    linkLabel: '',
    linkUrl: '',
  },
  applyPath: '기관 홈페이지 → 지원사업 신청',
  documents: [
    {
      label: '주민등록등본',
      checked: false,
      description: '주소, 세대 구성 정보를 확인하는 서류',
      issueMethod: '정부24에서 무료로 발급 가능',
      preparation: '본인 인증',
      linkLabel: '정부24에서 발급하기',
      linkUrl: 'https://www.gov.kr',
    },
    {
      label: '신분증',
      checked: false,
      description: '본인을 확인할 수 있는 신분증',
      issueMethod: '이미 보유한 신분증을 그대로 사용',
      preparation: '없음',
      linkLabel: '',
      linkUrl: '',
    },
  ],
  orgUrl: '',
};

const POLICY_DETAILS = {
  1: {
    disclaimer: '최종 지원 대상 여부는 해당 기관의 심사 결과에 따라 달라질 수 있습니다.',
    summary:
      '사업요약 : LH 자립준비청년 및 가정 밖 청소년에게 에너지비용 지원, 임대주택 입주 청년들 냉방비 부담 해소 뒷받침',
    supportInfo: [
      { label: '지원 내용', value: '에너지 비용 지원' },
      { label: '지원 금액', value: '1인당 40만원' },
      { label: '신청 기간', value: '2026.06.23 ~ 2026.12.14' },
    ],
    eligibility: [
      { text: '자립준비청년 또는 가정 밖 청소년', status: 'met' },
      { text: 'LH 임대주택 입주자 또는 입주 예정자', status: 'needCheck' },
      { text: '만 34세 이하', status: 'met' },
    ],
    applyPeriod: '2026.06.23 ~ 2026.12.14',
    applyMethod: {
      before: 'LH청약플러스 (',
      after: ') 내 ‘유스타트’ 접속 (* 지급까지 약 1개월 소요)',
      linkLabel: 'https://apply.lh.or.kr',
      linkUrl: 'https://apply.lh.or.kr',
    },
    applyPath:
      'LH 청약플러스 → 청약(임대주택) → 유스타트(자립 및 가정밖청소년) → 생활지원 → 에너지 생활안정 지원사업',
    documents: [
      {
        label: '주민등록등본',
        checked: true,
        description: '주소, 세대 구성 정보를 확인하는 서류',
        issueMethod: '정부24에서 무료로 발급 가능',
        preparation: '본인 인증',
        linkLabel: '정부24에서 발급하기',
        linkUrl: 'https://www.gov.kr',
      },
      {
        label: '신분증',
        checked: true,
        description: '본인을 확인할 수 있는 신분증',
        issueMethod: '이미 보유한 신분증을 그대로 사용',
        preparation: '없음',
        linkLabel: '',
        linkUrl: '',
      },
      {
        label: '자립준비청년 자격 확인 서류',
        checked: false,
        description: '자립준비청년 자격을 증명하는 서류',
        issueMethod: '거주지 주민센터에서 발급',
        preparation: '신분증',
        linkLabel: '정부24에서 발급하기',
        linkUrl: 'https://www.gov.kr',
      },
      {
        label: '임대주택 관련 서류',
        checked: false,
        description: 'LH 임대주택 계약을 확인하는 서류',
        issueMethod: 'LH청약플러스에서 발급',
        preparation: '공동인증서',
        linkLabel: 'LH청약플러스에서 발급하기',
        linkUrl: 'https://apply.lh.or.kr',
      },
    ],
    orgUrl: 'https://apply.lh.or.kr',
  },
};

export function getPolicyDetail(id) {
  return POLICY_DETAILS[id] || DEFAULT_DETAIL;
}
