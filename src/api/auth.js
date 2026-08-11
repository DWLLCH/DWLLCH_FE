/* 테스트용 -> 이메일에 "test" 들어가면 중복으로 뜨는 임시 목업 */
export function checkEmailDuplicate(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ available: !email.includes('test') });
    }, 300);
  });
}
