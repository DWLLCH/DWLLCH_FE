import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import trash from '../assets/trash.svg';
import warningTriangle from '../assets/warning_triangle.svg';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TextField from '../components/TextField';
import AccountChangeSuccess from '../components/AccountChangeSuccess';
import { withdrawAccount } from '../api/account';
import { clearTokens } from '../api/auth';
import '../styles/AccountChange.css';
import '../styles/AccountWithdraw.css';

const STEP_TITLE = {
  info: '회원 탈퇴 안내',
  confirm: '회원 탈퇴 확인',
  complete: '회원 탈퇴 완료',
};

function AccountWithdraw() {
  const navigate = useNavigate();
  const [step, setStep] = useState('info');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('info');
      return;
    }
    if (step === 'complete') {
      // 탈퇴가 끝난 계정이라 마이페이지로는 되돌아갈 수 없음
      navigate('/login', { replace: true });
      return;
    }
    navigate(-1);
  };

  const handlePasswordChange = (e) => {
    setPasswordError('');
    setPassword(e.target.value);
  };

  const handleWithdraw = async () => {
    if (isSubmitting || !password) return;
    setIsSubmitting(true);
    setPasswordError('');

    try {
      await withdrawAccount({ password });
    } catch (error) {
      const code = error.response?.data?.code;
      if (code === 'AUTH_400_CURRENT_PASSWORD_MISMATCH') {
        setPasswordError('비밀번호가 일치하지 않아요');
      } else {
        setErrorOpen(true);
      }
      setIsSubmitting(false);
      return;
    }

    // 탈퇴 자체는 이미 성공했으므로, 토큰 정리 중 예외가 나더라도 탈퇴 실패로 취급하지 않음
    // (정리가 안 되더라도 완료 화면의 handleComplete에서 한 번 더 clearTokens를 호출함)
    try {
      clearTokens();
    } catch {
      // 무시함
    }
    setStep('complete');
    setIsSubmitting(false);
  };

  const handleComplete = () => {
    clearTokens();
    navigate('/login', { replace: true });
  };

  return (
    <div className="account-change-page">
      <header className="account-change-header">
        <button
          type="button"
          className="account-change-back"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>{STEP_TITLE[step]}</h1>
      </header>

      {step === 'info' && (
        <div className="withdraw-body">
          <span className="withdraw-icon-circle">
            <img src={trash} alt="" />
          </span>
          <p className="withdraw-heading">정말 탈퇴하시겠어요?</p>
          <p className="withdraw-desc">
            회원 탈퇴 시 모든 서비스 이용이 중단되며,
            <br />
            계정 정보는 30일 후 삭제됩니다.
          </p>
          <ul className="withdraw-notice">
            <li>작성한 글, 댓글은 삭제되지 않아요.</li>
            <li>동일 이메일로 30일간 재가입이 불가해요.</li>
          </ul>
          <div className="withdraw-actions">
            <Button fullWidth variant="danger" onClick={() => setStep('confirm')}>
              계속
            </Button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="withdraw-body">
          <img src={warningTriangle} alt="" className="withdraw-icon-warning" />
          <p className="withdraw-heading">정말 탈퇴하시겠어요?</p>
          <p className="withdraw-heading withdraw-heading--danger">이 작업은 되돌릴 수 없어요.</p>
          <p className="withdraw-desc">
            탈퇴 후 30일간 동일 이메일로
            <br />
            재가입이 불가합니다.
          </p>
          <div className="withdraw-password-section">
            <TextField
              id="withdraw-password"
              name="password"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="account-change-message account-change-message--error">
                {passwordError}
              </p>
            )}
          </div>
          <div className="withdraw-actions">
            <Button
              fullWidth
              variant="danger"
              disabled={isSubmitting || !password}
              onClick={handleWithdraw}
            >
              탈퇴합니다
            </Button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <AccountChangeSuccess
          message="회원 탈퇴가 완료되었습니다."
          description="이용해 주셔서 감사합니다."
          onConfirm={handleComplete}
        />
      )}

      <Modal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="탈퇴 처리에 실패했어요"
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

export default AccountWithdraw;
