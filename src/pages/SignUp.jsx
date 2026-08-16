import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import DuplicateCheckButton from '../components/DuplicateCheckButton';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import TermsContent from '../components/TermsContent';
import arrowBottom from '../assets/arrow_bottom.svg';
import arrowUp from '../assets/arrow_up.svg';
import { checkEmailDuplicate, checkUsernameDuplicate } from '../api/auth';
import { TERMS_CONTENT } from '../constants/terms';
import { getPasswordRules, isValidEmail, isValidId } from '../utils/validators';
import '../styles/SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', id: '', password: '', passwordConfirm: '' });
  const [emailStatus, setEmailStatus] = useState('idle');
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const [agreements, setAgreements] = useState({ privacy: false, terms: false, marketing: false });
  const [expandedTerms, setExpandedTerms] = useState({
    privacy: false,
    terms: false,
    marketing: false,
  });
  const emailCheckId = useRef(0);
  const usernameCheckId = useRef(0);

  const passwordRules = getPasswordRules(form.password);
  const isPasswordValid = passwordRules.length && passwordRules.alnum && passwordRules.special;
  const isIdValid = isValidId(form.id);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const allChecked = agreements.privacy && agreements.terms && agreements.marketing;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      emailCheckId.current += 1;
      setEmailStatus('idle');
    }
    if (name === 'id') {
      usernameCheckId.current += 1;
      setUsernameStatus('idle');
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckEmail = async () => {
    if (!isValidEmail(form.email)) {
      setEmailStatus('invalid');
      return;
    }
    const requestId = ++emailCheckId.current;
    try {
      const { available } = await checkEmailDuplicate(form.email);
      if (requestId !== emailCheckId.current) return;
      setEmailStatus(available ? 'available' : 'duplicate');
    } catch (error) {
      if (requestId !== emailCheckId.current) return;
      // 409(이미 가입된 이메일)는 duplicate, 400(형식 오류)는 invalid, 그 외는 error
      if (error.response?.status === 409) {
        setEmailStatus('duplicate');
      } else if (error.response?.status === 400) {
        setEmailStatus('invalid');
      } else {
        setEmailStatus('error');
      }
    }
  };

  const handleCheckUsername = async () => {
    if (!isIdValid) {
      setUsernameStatus('invalid');
      return;
    }
    const requestId = ++usernameCheckId.current;
    try {
      const { available } = await checkUsernameDuplicate(form.id);
      if (requestId !== usernameCheckId.current) return;
      setUsernameStatus(available ? 'available' : 'duplicate');
    } catch (error) {
      if (requestId !== usernameCheckId.current) return;
      // 409(이미 사용 중인 아이디)는 duplicate, 400(형식 오류)는 invalid, 그 외는  error
      if (error.response?.status === 409) {
        setUsernameStatus('duplicate');
      } else if (error.response?.status === 400) {
        setUsernameStatus('invalid');
      } else {
        setUsernameStatus('error');
      }
    }
  };

  const handleToggleAll = () => {
    const next = !allChecked;
    setAgreements({ privacy: next, terms: next, marketing: next });
  };

  const handleToggleOne = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleExpand = (key) => {
    setExpandedTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isFormValid =
    emailStatus === 'available' &&
    usernameStatus === 'available' &&
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
            autoComplete="email"
            rightElement={
              <DuplicateCheckButton
                status={emailStatus}
                onClick={handleCheckEmail}
                disabled={!form.email}
              />
            }
          />
          {emailStatus === 'available' && (
            <p className="signup-field-message signup-field-message--success">
              사용 가능한 이메일입니다
            </p>
          )}
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
          {emailStatus === 'error' && (
            <p className="signup-field-message signup-field-message--error">
              확인 중 오류가 발생했어요. 다시 시도해주세요.
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
            rightElement={
              <DuplicateCheckButton
                status={usernameStatus}
                onClick={handleCheckUsername}
                disabled={!form.id}
              />
            }
          />
          {usernameStatus === 'available' && (
            <p className="signup-field-message signup-field-message--success">
              사용 가능한 아이디입니다
            </p>
          )}
          {usernameStatus === 'duplicate' && (
            <p className="signup-field-message signup-field-message--error">
              이미 사용 중인 아이디입니다
            </p>
          )}
          {usernameStatus === 'error' && (
            <p className="signup-field-message signup-field-message--error">
              확인 중 오류가 발생했어요. 다시 시도해주세요.
            </p>
          )}
          {/* 중복확인 전(idle)이거나 형식오류(invalid)일 때는, 타이핑하는 즉시 형식만 실시간으로 안내 */}
          {(usernameStatus === 'idle' || usernameStatus === 'invalid') && form.id && !isIdValid && (
            <p className="signup-field-message signup-field-message--error">
              영문, 숫자 조합 8~12자로 입력해주세요
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
            autoComplete="new-password"
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
            autoComplete="new-password"
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
            <Checkbox
              id="agree-all"
              checked={allChecked}
              onChange={handleToggleAll}
              ariaLabel="전체 동의하기"
            />
            <label htmlFor="agree-all" className="signup-term-label">
              전체 동의하기
            </label>
          </div>
          <div className="signup-term-group">
            <div className="signup-term">
              <Checkbox
                id="agree-privacy"
                checked={agreements.privacy}
                onChange={() => handleToggleOne('privacy')}
                ariaLabel="개인정보 수집 및 이용 동의 (필수)"
              />
              <label htmlFor="agree-privacy" className="signup-term-label">
                개인정보 수집 및 이용 동의 (필수)
              </label>
              <button
                type="button"
                className="signup-term-arrow-btn"
                onClick={() => handleToggleExpand('privacy')}
                aria-expanded={expandedTerms.privacy}
                aria-label={`개인정보 수집 및 이용 동의 내용 ${expandedTerms.privacy ? '접기' : '보기'}`}
              >
                <img
                  src={expandedTerms.privacy ? arrowUp : arrowBottom}
                  alt=""
                  className="signup-term-arrow"
                />
              </button>
            </div>
            {expandedTerms.privacy && <TermsContent {...TERMS_CONTENT.privacy} />}
          </div>

          <div className="signup-term-group">
            <div className="signup-term">
              <Checkbox
                id="agree-terms"
                checked={agreements.terms}
                onChange={() => handleToggleOne('terms')}
                ariaLabel="서비스 이용약관 (필수)"
              />
              <label htmlFor="agree-terms" className="signup-term-label">
                서비스 이용약관 (필수)
              </label>
              <button
                type="button"
                className="signup-term-arrow-btn"
                onClick={() => handleToggleExpand('terms')}
                aria-expanded={expandedTerms.terms}
                aria-label={`서비스 이용약관 내용 ${expandedTerms.terms ? '접기' : '보기'}`}
              >
                <img
                  src={expandedTerms.terms ? arrowUp : arrowBottom}
                  alt=""
                  className="signup-term-arrow"
                />
              </button>
            </div>
            {expandedTerms.terms && <TermsContent {...TERMS_CONTENT.terms} />}
          </div>

          <div className="signup-term-group">
            <div className="signup-term">
              <Checkbox
                id="agree-marketing"
                checked={agreements.marketing}
                onChange={() => handleToggleOne('marketing')}
                ariaLabel="알림 및 마케팅 정보 수신 동의 (선택)"
              />
              <label htmlFor="agree-marketing" className="signup-term-label">
                알림 및 마케팅 정보 수신 동의 <span className="signup-term-optional">(선택)</span>
              </label>
              <button
                type="button"
                className="signup-term-arrow-btn"
                onClick={() => handleToggleExpand('marketing')}
                aria-expanded={expandedTerms.marketing}
                aria-label={`알림 및 마케팅 정보 수신 동의 내용 ${expandedTerms.marketing ? '접기' : '보기'}`}
              >
                <img
                  src={expandedTerms.marketing ? arrowUp : arrowBottom}
                  alt=""
                  className="signup-term-arrow"
                />
              </button>
            </div>
            {expandedTerms.marketing && <TermsContent {...TERMS_CONTENT.marketing} />}
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
