import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { getNewPasswordRules } from '../utils/validators';
import '../styles/AccountChange.css';

function PasswordChange() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    newPasswordConfirm: '',
    currentPassword: '',
  });
  const [toastMessage, setToastMessage] = useState('');
  const navigateTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
    },
    [],
  );

  const passwordRules = getNewPasswordRules(form.newPassword);
  const isNewPasswordValid = passwordRules.length && passwordRules.combination;
  const isConfirmValid =
    form.newPasswordConfirm.length > 0 && form.newPassword === form.newPasswordConfirm;
  const isCurrentPasswordValid = form.currentPassword.length > 0;
  const isFormValid = isNewPasswordValid && isConfirmValid && isCurrentPasswordValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setToastMessage('비밀번호가 변경됐어요');
    navigateTimerRef.current = setTimeout(() => navigate('/mypage', { replace: true }), 1200);
  };

  return (
    <div className="account-change-page">
      <header className="account-change-header">
        <button
          type="button"
          className="account-change-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>비밀번호 변경</h1>
      </header>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />

      <form className="account-change-body" onSubmit={handleSubmit}>
        <section className="account-change-section">
          <div className="account-change-heading">
            <p className="account-change-label">새 비밀번호</p>
            <p className="account-change-helper">영문, 숫자, 특수문자를 모두 조합한 8~20자</p>
          </div>
          <TextField
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="새 비밀번호"
            value={form.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {form.newPassword && !isNewPasswordValid && (
            <p className="account-change-message account-change-message--error">
              비밀번호 조건을 확인해주세요
            </p>
          )}
          <TextField
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
            placeholder="새 비밀번호 확인"
            value={form.newPasswordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {form.newPasswordConfirm && (
            <p
              className={`account-change-message${isConfirmValid ? ' account-change-message--success' : ' account-change-message--error'}`}
            >
              {isConfirmValid ? '비밀번호가 일치해요' : '비밀번호가 일치하지 않아요'}
            </p>
          )}
        </section>

        <section className="account-change-section">
          <p className="account-change-label">현재 비밀번호</p>
          <TextField
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="현재 비밀번호"
            value={form.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </section>

        <div className="account-change-notice">
          <p className="account-change-notice-title">잠깐! 타인에 의한 계정 사용이 의심되나요?</p>
          <p className="account-change-notice-desc">
            개인정보 보호를 위해 비밀번호를 변경해 주세요.
            <br />
            변경 시 모든 디바이스에서 로그아웃 처리돼요.
          </p>
        </div>

        <Button type="submit" fullWidth disabled={!isFormValid}>
          비밀번호 변경
        </Button>
      </form>
    </div>
  );
}

export default PasswordChange;
