import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import warningCircle from '../assets/warning_circle.svg';
import '../styles/OnboardingRequiredModal.css';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function OnboardingRequiredModal({ open, onClose }) {
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
    <div className="onboarding-required-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="onboarding-required-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-required-title"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={warningCircle} alt="" className="onboarding-required-icon" />
        <p className="onboarding-required-title" id="onboarding-required-title">
          온보딩이 아직 완료되지 않았어요!
        </p>
        <p className="onboarding-required-desc">
          정확한 맞춤 정보를 제공하기 위해
          <br />
          온보딩을 먼저 완료해주세요
        </p>
        <div className="onboarding-required-actions">
          <Button variant="gray" onClick={onClose}>
            홈으로 이동
          </Button>
          <Button onClick={() => navigate('/onboarding/1')}>온보딩 시작하기</Button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingRequiredModal;
