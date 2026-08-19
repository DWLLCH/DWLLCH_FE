import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import TextField from '../components/TextField';
import DuplicateCheckButton from '../components/DuplicateCheckButton';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AccountChangeSuccess from '../components/AccountChangeSuccess';
import { isValidEmail } from '../utils/validators';
import { checkEmailDuplicate } from '../api/auth';
import { changeEmail } from '../api/account';
import '../styles/AccountChange.css';

function EmailChange() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newEmail: '', accountPassword: '' });
  const [emailStatus, setEmailStatus] = useState('idle');
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [accountPasswordError, setAccountPasswordError] = useState('');
  const emailCheckId = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isEmailFormatValid = isValidEmail(form.newEmail);
  const isPasswordValid = form.accountPassword.length > 0;
  const isFormValid = emailStatus === 'available' && isPasswordValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newEmail') {
      emailCheckId.current += 1;
      setEmailStatus('idle');
    }
    if (name === 'accountPassword') setAccountPasswordError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckEmail = async () => {
    if (!isEmailFormatValid) {
      setEmailStatus('invalid');
      return;
    }
    const requestId = ++emailCheckId.current;
    try {
      const { available } = await checkEmailDuplicate(form.newEmail);
      if (requestId !== emailCheckId.current) return;
      setEmailStatus(available ? 'available' : 'duplicate');
    } catch (error) {
      if (requestId !== emailCheckId.current) return;
      if (error.response?.status === 409) {
        setEmailStatus('duplicate');
      } else if (error.response?.status === 400) {
        setEmailStatus('invalid');
      } else {
        setEmailStatus('error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    setAccountPasswordError('');
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
      setIsComplete(true);
    } catch (error) {
      if (!isMountedRef.current) return;
      setIsSubmitting(false);
      const code = error.response?.data?.code;
      if (code === 'AUTH_400_ACCOUNT_PASSWORD_MISMATCH') {
        setAccountPasswordError('계정 비밀번호가 일치하지 않아요');
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

      {isComplete ? (
        <AccountChangeSuccess
          message="이메일 변경이 완료되었습니다."
          onConfirm={() => navigate('/mypage', { replace: true })}
        />
      ) : (
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
              rightElement={
                <DuplicateCheckButton
                  status={emailStatus}
                  onClick={handleCheckEmail}
                  disabled={!form.newEmail}
                />
              }
            />
            {emailStatus === 'available' && (
              <p className="account-change-message account-change-message--success">
                사용 가능한 이메일이에요
              </p>
            )}
            {emailStatus === 'duplicate' && (
              <p className="account-change-message account-change-message--error">
                이미 사용 중인 이메일이에요
              </p>
            )}
            {emailStatus === 'error' && (
              <p className="account-change-message account-change-message--error">
                확인 중 오류가 발생했어요. 다시 시도해주세요.
              </p>
            )}
            {(emailStatus === 'idle' || emailStatus === 'invalid') &&
              form.newEmail &&
              !isEmailFormatValid && (
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
            {accountPasswordError && (
              <p className="account-change-message account-change-message--error">
                {accountPasswordError}
              </p>
            )}
          </section>

          <Button type="submit" fullWidth disabled={!isFormValid || isSubmitting}>
            이메일 변경
          </Button>
        </form>
      )}

      <Modal
        open={Boolean(submitError)}
        onClose={() => setSubmitError('')}
        title="이메일 변경에 실패했어요"
        description={
          <>
            일시적인 오류일 수 있어요.
            <br />
            잠시 후 다시 시도해주세요.
          </>
        }
      />
    </div>
  );
}

export default EmailChange;
