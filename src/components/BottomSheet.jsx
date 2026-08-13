import { useEffect, useRef } from 'react';
import '../styles/BottomSheet.css';

let scrollLockCount = 0;
let previousBodyOverflow = '';

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

function BottomSheet({ open, onClose, children, footer }) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    lockBodyScroll();

    return () => {
      unlockBodyScroll();
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

  return (
    <div
      className={`bottom-sheet-backdrop${open ? ' bottom-sheet-backdrop--open' : ''}`}
      onClick={onClose}
    >
      <div className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
        <span className="bottom-sheet-handle" />
        <div className="bottom-sheet-content">{children}</div>
        {footer && <div className="bottom-sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default BottomSheet;
