import Button from './Button';
import '../styles/AccountChange.css';

function AccountChangeSuccess({ message, onConfirm }) {
  return (
    <div className="account-change-success">
      <div className="account-change-success-content">
        <span className="account-change-success-icon">
          <svg width="44" height="33" viewBox="0 0 32 24" fill="none" aria-hidden="true">
            <path
              className="account-change-success-check"
              d="M2 13L11 22L30 2"
              stroke="#6cd59b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="account-change-success-message">{message}</p>
      </div>
      <Button fullWidth className="account-change-success-confirm" onClick={onConfirm}>
        확인
      </Button>
    </div>
  );
}

export default AccountChangeSuccess;
