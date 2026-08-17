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

export function formatDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
