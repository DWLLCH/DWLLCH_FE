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
