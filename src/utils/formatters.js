export function formatBirthDate(digits) {
  const parts = [digits.slice(0, 4)];
  if (digits.length > 4) parts.push(digits.slice(4, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 8));
  let formatted = parts.join('.');
  if (digits.length === 4 || digits.length === 6) formatted += '.';
  return formatted;
}

export function formatDateDots(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDateTimeShort(date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  const hour = String(parsed.getHours()).padStart(2, '0');
  const minute = String(parsed.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hour}:${minute}`;
}

/* Onboarding1.jsx가 들고 있는 "YYYYMMDD" 8자리 숫자 문자열을 백엔드가 받는 "YYYY-MM-DD"로 변환 */
export function formatBirthDateKey(digits) {
  if (!/^\d{8}$/.test(digits)) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

/* BE가 게시글 이미지 URL을 http 절대경로로 내려주는데, 배포 페이지는 https라서 그대로 쓰면
   브라우저가 mixed content로 막아버림 (로컬 개발은 페이지도 BE도 둘 다 http라 재현 안 됨)
   페이지 자체가 https로 떠 있고 이미지 URL이 http 절대경로일 때만 origin을 떼어 상대경로로 바꿔서,
   같은 origin인 Vercel이 vercel.json의 /media/:path* rewrite로 BE http 주소까지 대신 프록시하게 함 */
export function toSecureImageUrl(url) {
  if (!url) return url;
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return url;
  if (!url.startsWith('http://')) return url;
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

/* 커뮤니티 목록 등에서 쓰는 "N분 전", "N시간 전" 같은 상대 시간 표기 */
export function formatRelativeTime(date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  const diffMinutes = Math.floor((Date.now() - parsed.getTime()) / (60 * 1000));
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDateDots(parsed);
}

/* 정책 신청 마감일(applicationEnd, "YYYY-MM-DD")을 D-day 배지 문자열로 변환
   마감일이 없으면(상시모집) "상시모집", 형식이 잘못됐으면 null, 이미 지났으면 "마감" */
export function formatDday(applicationEnd) {
  if (!applicationEnd) return '상시모집';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(applicationEnd);
  if (!match) return null;

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const end = new Date(year, month - 1, day);
  const isValidCalendarDate =
    end.getFullYear() === year && end.getMonth() === month - 1 && end.getDate() === day;
  if (!isValidCalendarDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffDays = Math.round((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-DAY';
  return `D-${diffDays}`;
}

/* 정책 신청 시작일/종료일("YYYY-MM-DD")을 "YYYY.MM.DD ~ YYYY.MM.DD" 형태로 변환
   둘 다 없으면 "상시 모집", 하나만 있으면 있는 값만 표시 */
export function formatDateRangeDots(start, end) {
  const toDots = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) return null;
    const [, year, month, day] = match;
    return `${year}.${month}.${day}`;
  };

  const startText = toDots(start);
  const endText = toDots(end);

  if (!startText && !endText) return '상시 모집';
  if (startText && endText) return `${startText} ~ ${endText}`;
  return startText || endText;
}

/* content 필드가 "1. 항목1 2. 항목2 3. 항목3" 처럼 번호 목록이 한 줄로 붙어서 오는 경우
   "숫자. " 패턴 앞에서 끊어서 줄 단위 배열로 변환함 (렌더링에서 항목마다 줄바꿈 삽입용)
   번호 목록이 아니면(패턴이 없거나 1개뿐이면) 원본 텍스트 그대로 배열 하나로 반환함 */
export function splitNumberedText(text) {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  // "3. 1"처럼 숫자 뒤에 또 숫자가 오는 날짜 표기("2025. 3. 1.")는 번호 목록으로 오인하지 않도록
  // "숫자. " 바로 뒤에 숫자가 오지 않는 경우에만(=진짜 목록 항목 시작 위치) 끊음
  const parts = trimmed.split(/\s*(?=\d+\.\s(?!\d))/).filter(Boolean);
  return parts.length > 1 ? parts : [trimmed];
}

// BE 정책 매칭 등급("HIGH"/"MEDIUM"/"LOW")을 constants/supportList.js의 LEVEL_CONFIG 키로 변환
// 비로그인/프로필 미완성 등으로 매칭 안 된 경우 matchLevel이 null로 오는데 그대로 null 반환
const MATCH_LEVEL_TO_KEY = { HIGH: 'high', MEDIUM: 'mid', LOW: 'low' };
export function toPolicyLevel(matchLevel) {
  return MATCH_LEVEL_TO_KEY[matchLevel] || null;
}

/* 정책 requiredDocuments(BE가 [{label, description, issueMethod, preparation, issuer, linkUrl}]
   객체 배열로 내려줌)를 체크리스트 항목 배열로 정규화함 (PolicyDetail.jsx, DocumentGuide.jsx 공용)
   checked는 로컬 준비 상태 초기값이라 항상 false로 시작함 */
export function parseRequiredDocuments(requiredDocuments) {
  if (!Array.isArray(requiredDocuments)) return [];

  return requiredDocuments
    .filter((doc) => doc && doc.label)
    .map((doc) => ({
      label: doc.label,
      description: doc.description || null,
      issueMethod: doc.issueMethod || null,
      preparation: doc.preparation || null,
      issuer: doc.issuer || null,
      linkUrl: doc.linkUrl || null,
      checked: false,
    }));
}

export function formatDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey || '');
  if (!match) return null;
  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  const date = new Date(year, month, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}
