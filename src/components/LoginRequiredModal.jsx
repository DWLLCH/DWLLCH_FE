import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/LoginRequiredModal.css';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// TODO: 다른 프론트가 작업 중인 공통 에러 모달이 머지되면, 이 임시 모달 디자인은
// 그 공통 모달로 교체할 것 (지금은 머지 전이라 임시로 자체 마크업 사용)
function LoginRequiredModal({
  open,
  onClose,
  message = '로그인이 필요해요',
  description = '로그인하고 나의 자립 정보를 확인해보세요',
}) {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    const focusables = modalRef.current
      ? Array.from(modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="login-required-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="login-required-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="login-required-title" id="login-required-title">
          {message}
        </p>
        <p className="login-required-desc">{description}</p>
        <div className="login-required-actions">
          <Button variant="gray" onClick={onClose}>
            나중에 할게요
          </Button>
          <Button onClick={() => navigate('/login')}>로그인하러 가기</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
