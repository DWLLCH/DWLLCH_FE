import { useEffect, useRef } from 'react';
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
}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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
      if (event.key === 'Escape') onClose();
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
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <p className="modal-title">{title}</p>}
        {description && <p className="modal-description">{description}</p>}
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
      </div>
    </div>
  );
}

export default Modal;
