import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import DuplicateCheckButton from '../components/DuplicateCheckButton';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import arrowRight from '../assets/arrow_right.svg';
import { checkEmailDuplicate } from '../api/auth';
import { getPasswordRules, isValidEmail, isValidId } from '../utils/validators';
import '../styles/SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', id: '', password: '', passwordConfirm: '' });
  const [emailStatus, setEmailStatus] = useState('idle');
  const [agreements, setAgreements] = useState({ privacy: false, terms: false, marketing: false });

  const passwordRules = getPasswordRules(form.password);
  const isPasswordValid = passwordRules.length && passwordRules.alnum && passwordRules.special;
  const isIdValid = isValidId(form.id);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const allChecked = agreements.privacy && agreements.terms && agreements.marketing;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmailStatus('idle');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckEmail = async () => {
    if (!isValidEmail(form.email)) {
      setEmailStatus('invalid');
      return;
    }
    const { available } = await checkEmailDuplicate(form.email);
    setEmailStatus(available ? 'available' : 'duplicate');
  };

  const handleToggleAll = () => {
    const next = !allChecked;
    setAgreements({ privacy: next, terms: next, marketing: next });
  };

  const handleToggleOne = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isFormValid =
    emailStatus === 'available' &&
    isIdValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    agreements.privacy &&
    agreements.terms;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate('/signup/complete');
  };

  return (
    <div className="signup">
      {/* 헤더 */}
      <header className="signup-header">
        <h1>회원가입</h1>
      </header>

      <form className="signup-body" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="signup-field signup-field--email">
          <TextField
            id="email"
            name="email"
            label="이메일"
            type="email"
            placeholder="메일 주소를 입력해주세요"
            value={form.email}
            onChange={handleChange}
            rightElement={
              <DuplicateCheckButton
                status={emailStatus}
                onClick={handleCheckEmail}
                disabled={!form.email}
              />
            }
          />
          {emailStatus === 'duplicate' && (
            <p className="signup-field-message signup-field-message--error">
              이미 사용 중인 이메일입니다
            </p>
          )}
          {emailStatus === 'invalid' && (
            <p className="signup-field-message signup-field-message--error">
              올바른 이메일 형식이 아닙니다
            </p>
          )}
        </div>

        {/* 아이디 */}
        <div className="signup-field signup-field--id">
          <TextField
            id="userId"
            name="id"
            label="아이디"
            type="text"
            placeholder="영문, 숫자 조합(8~12자)"
            value={form.id}
            onChange={handleChange}
          />
          {form.id && (
            <p
              className={`signup-field-message${isIdValid ? ' signup-field-message--success' : ' signup-field-message--error'}`}
            >
              {isIdValid ? '사용 가능한 아이디입니다' : '영문, 숫자 조합 8~12자로 입력해주세요'}
            </p>
          )}
        </div>

        {/* 비밀번호 설정 */}
        <div className="signup-field signup-field--password">
          <TextField
            id="password"
            name="password"
            label="비밀번호 설정"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={form.password}
            onChange={handleChange}
          />
          <ul className="password-checklist">
            <li
              className={`password-checklist-item${passwordRules.length ? ' password-checklist-item--valid' : ''}`}
            >
              <span className="password-checklist-icon" />
              8자 이상
            </li>
            <li
              className={`password-checklist-item${passwordRules.alnum ? ' password-checklist-item--valid' : ''}`}
            >
              <span className="password-checklist-icon" />
              영문, 숫자
            </li>
            <li
              className={`password-checklist-item${passwordRules.special ? ' password-checklist-item--valid' : ''}`}
            >
              <span className="password-checklist-icon" />
              특수문자 포함
            </li>
          </ul>
        </div>

        {/* 비밀번호 확인 */}
        <div className="signup-field signup-field--password-confirm">
          <TextField
            id="passwordConfirm"
            name="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={form.passwordConfirm}
            onChange={handleChange}
          />
          {form.passwordConfirm && (
            <p
              className={`signup-field-message${isPasswordConfirmValid ? ' signup-field-message--success' : ' signup-field-message--error'}`}
            >
              {isPasswordConfirmValid ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
            </p>
          )}
        </div>

        {/* 약관 동의 */}
        <div className="signup-terms">
          <div className="signup-term signup-term--all">
            <Checkbox id="agree-all" checked={allChecked} onChange={handleToggleAll} />
            <label htmlFor="agree-all" className="signup-term-label">
              전체 동의하기
            </label>
          </div>
          <div className="signup-term">
            <Checkbox
              id="agree-privacy"
              checked={agreements.privacy}
              onChange={() => handleToggleOne('privacy')}
            />
            <label htmlFor="agree-privacy" className="signup-term-label">
              개인정보 수집 및 이용 동의 (필수)
            </label>
            <img src={arrowRight} alt="" className="signup-term-arrow" />
          </div>
          <div className="signup-term">
            <Checkbox
              id="agree-terms"
              checked={agreements.terms}
              onChange={() => handleToggleOne('terms')}
            />
            <label htmlFor="agree-terms" className="signup-term-label">
              서비스 이용약관 (필수)
            </label>
            <img src={arrowRight} alt="" className="signup-term-arrow" />
          </div>
          <div className="signup-term">
            <Checkbox
              id="agree-marketing"
              checked={agreements.marketing}
              onChange={() => handleToggleOne('marketing')}
            />
            <label htmlFor="agree-marketing" className="signup-term-label">
              알림 및 마케팅 정보 수신 동의 <span className="signup-term-optional">(선택)</span>
            </label>
            <img src={arrowRight} alt="" className="signup-term-arrow" />
          </div>
        </div>

        <Button type="submit" fullWidth disabled={!isFormValid}>
          가입완료
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
