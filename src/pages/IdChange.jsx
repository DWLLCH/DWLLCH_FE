import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import TextField from '../components/TextField';
import DuplicateCheckButton from '../components/DuplicateCheckButton';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AccountChangeSuccess from '../components/AccountChangeSuccess';
import { isValidId } from '../utils/validators';
import { checkUsernameDuplicate } from '../api/auth';
import { changeUsername } from '../api/account';
import '../styles/AccountChange.css';

function IdChange() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newId: '', accountPassword: '' });
  const [idStatus, setIdStatus] = useState('idle');
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [accountPasswordError, setAccountPasswordError] = useState('');
  const idCheckId = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isIdFormatValid = isValidId(form.newId);
  const isPasswordValid = form.accountPassword.length > 0;
  const isFormValid = idStatus === 'available' && isPasswordValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newId') {
      idCheckId.current += 1;
      setIdStatus('idle');
    }
    if (name === 'accountPassword') setAccountPasswordError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckId = async () => {
    if (!isIdFormatValid) {
      setIdStatus('invalid');
      return;
    }
    const requestId = ++idCheckId.current;
    try {
      const { available } = await checkUsernameDuplicate(form.newId);
      if (requestId !== idCheckId.current) return;
      setIdStatus(available ? 'available' : 'duplicate');
    } catch (error) {
      if (requestId !== idCheckId.current) return;
      if (error.response?.status === 409) {
        setIdStatus('duplicate');
      } else if (error.response?.status === 400) {
        setIdStatus('invalid');
      } else {
        setIdStatus('error');
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
      const response = await changeUsername({
        newUsername: form.newId,
        accountPassword: form.accountPassword,
      });
      if (!isMountedRef.current) return;
      if (!response.success) {
        setIsSubmitting(false);
        setSubmitError('아이디 변경에 실패했어요. 다시 시도해주세요');
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
        setSubmitError('아이디 변경에 실패했어요. 다시 시도해주세요');
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
        <h1>아이디 변경</h1>
      </header>

      {isComplete ? (
        <AccountChangeSuccess
          message="아이디 변경이 완료되었습니다."
          onConfirm={() => navigate('/mypage', { replace: true })}
        />
      ) : (
        <form className="account-change-body" onSubmit={handleSubmit}>
          <section className="account-change-section">
            <div className="account-change-heading">
              <p className="account-change-label">새 아이디</p>
              <p className="account-change-helper">영문, 숫자 조합 8~12자로 입력하세요.</p>
            </div>
            <TextField
              id="newId"
              name="newId"
              type="text"
              placeholder="새 아이디"
              value={form.newId}
              onChange={handleChange}
              rightElement={
                <DuplicateCheckButton
                  status={idStatus}
                  onClick={handleCheckId}
                  disabled={!form.newId}
                />
              }
            />
            {idStatus === 'available' && (
              <p className="account-change-message account-change-message--success">
                사용 가능한 아이디예요
              </p>
            )}
            {idStatus === 'duplicate' && (
              <p className="account-change-message account-change-message--error">
                이미 사용 중인 아이디예요
              </p>
            )}
            {idStatus === 'error' && (
              <p className="account-change-message account-change-message--error">
                확인 중 오류가 발생했어요. 다시 시도해주세요.
              </p>
            )}
            {(idStatus === 'idle' || idStatus === 'invalid') && form.newId && !isIdFormatValid && (
              <p className="account-change-message account-change-message--error">
                영문, 숫자 조합 8~12자로 입력해주세요
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
            아이디 변경
          </Button>
        </form>
      )}

      <Modal
        open={Boolean(submitError)}
        onClose={() => setSubmitError('')}
        title="아이디 변경에 실패했어요"
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

export default IdChange;
