import { useEffect, useId, useRef } from 'react';
import '../styles/Modal.css';

function Modal({
  open,
  onClose,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel,
  onConfirm,
  danger = false,
  children,
}) {
  const triggerRef = useRef(null);
  const modalRef = useRef(null);
  // description이 있을 때만 aria-describedby로 연결, id는 Modal이 여러 개 떠도 안 겹치게 useId로 생성
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = modalRef.current?.querySelectorAll('button:not(:disabled)');
    const cancelBtn = modalRef.current?.querySelector('.modal-btn--cancel');
    (cancelBtn || focusable?.[focusable.length - 1])?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll('button:not(:disabled)');
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    else onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <p className="modal-title">{title}</p>}
        {description && (
          <p id={descriptionId} className="modal-description">
            {description}
          </p>
        )}
        {children || (
          <div className="modal-actions">
            {cancelLabel && (
              <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={`modal-btn modal-btn--confirm${danger ? ' modal-btn--danger' : ''}`}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
