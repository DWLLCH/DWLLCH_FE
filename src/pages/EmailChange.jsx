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
  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigateTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
    };
  }, []);

  const isEmailValid = isValidEmail(form.newEmail);
  const isPasswordValid = form.currentPassword.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await changeEmail({
        newEmail: form.newEmail,
        currentPassword: form.currentPassword,
      });
      if (!isMountedRef.current) return;
      if (!response.success) {
        setIsSubmitting(false);
        setSubmitError('이메일 변경에 실패했어요. 다시 시도해주세요');
        return;
      }
      setToastMessage('이메일이 변경됐어요');
      navigateTimerRef.current = setTimeout(() => navigate('/mypage', { replace: true }), 1200);
    } catch (error) {
      if (!isMountedRef.current) return;
      setIsSubmitting(false);
      // AUTH_400_CURRENT_PASSWORD_MISMATCH(비밀번호 불일치)와 newEmail 필드 오류
      // (중복 이메일, 현재 이메일과 동일)는 구분해서 안내하고, 그 외는 일반 오류 문구를 보여줍니다
      const code = error.response?.data?.code;
      const newEmailError = error.response?.data?.data?.newEmail?.[0];
      if (code === 'AUTH_400_CURRENT_PASSWORD_MISMATCH') {
        setSubmitError('현재 비밀번호가 일치하지 않아요');
      } else if (newEmailError) {
        setSubmitError(newEmailError);
      } else {
        setSubmitError('이메일 변경에 실패했어요. 다시 시도해주세요');
      }
    }
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
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="계정 비밀번호"
            value={form.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </section>

        {submitError && (
          <p className="account-change-message account-change-message--error">{submitError}</p>
        )}

        <Button type="submit" fullWidth disabled={!isFormValid || isSubmitting}>
          이메일 변경
        </Button>
      </form>
    </div>
  );
}

export default EmailChange;
