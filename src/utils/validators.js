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
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}
