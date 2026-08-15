import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { isValidEmail } from '../utils/validators';
import { changeEmail } from '../api/account';
import '../styles/AccountChange.css';

function EmailChange() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newEmail: '', accountPassword: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigateTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
    },
    [],
  );

  const isEmailValid = isValidEmail(form.newEmail);
  const isPasswordValid = form.accountPassword.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    const response = await changeEmail({
      newEmail: form.newEmail,
      accountPassword: form.accountPassword,
    });
    if (!response.success) {
      setIsSubmitting(false);
      return;
    }
    setToastMessage('이메일이 변경됐어요');
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
        <h1>이메일 변경</h1>
      </header>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />

      <form className="account-change-body" onSubmit={handleSubmit}>
        <section className="account-change-section">
          <div className="account-change-heading">
            <p className="account-change-label">새 이메일</p>
            <p className="account-change-helper">반드시 본인 명의의 이메일을 입력하세요.</p>
          </div>
          <TextField
            id="newEmail"
            name="newEmail"
            type="email"
            placeholder="새 이메일"
            value={form.newEmail}
            onChange={handleChange}
            autoComplete="email"
          />
          {form.newEmail && !isEmailValid && (
            <p className="account-change-message account-change-message--error">
              올바른 이메일 형식이 아니에요
            </p>
          )}
        </section>

        <section className="account-change-section">
          <p className="account-change-label">계정 비밀번호</p>
          <TextField
            id="accountPassword"
            name="accountPassword"
            type="password"
            placeholder="계정 비밀번호"
            value={form.accountPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </section>

        <Button type="submit" fullWidth disabled={!isFormValid || isSubmitting}>
          이메일 변경
        </Button>
      </form>
    </div>
  );
}

export default EmailChange;
