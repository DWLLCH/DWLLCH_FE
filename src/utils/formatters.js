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
   마감일이 없으면 null, 이미 지났으면 "마감" */
export function formatDday(applicationEnd) {
  if (!applicationEnd) return null;

  const end = new Date(applicationEnd);
  if (Number.isNaN(end.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffDays = Math.round((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-DAY';
  return `D-${diffDays}`;
}

export function formatDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
