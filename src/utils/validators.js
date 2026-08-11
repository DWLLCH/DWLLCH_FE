export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidId(id) {
  return /^[A-Za-z0-9]{8,12}$/.test(id);
}

export function getPasswordRules(password) {
  return {
    length: password.length >= 8,
    alnum: /(?=.*[A-Za-z])(?=.*[0-9])/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password),
  };
}

export function isValidBirthDate(value) {
  if (!/^\d{8}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isRealDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}
