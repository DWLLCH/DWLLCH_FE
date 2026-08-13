import { useEffect, useRef } from 'react';
import '../styles/BottomSheet.css';

function BottomSheet({ open, onClose, children, footer }) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [open, onClose]);

  return (
    <div
      className={`bottom-sheet-backdrop${open ? ' bottom-sheet-backdrop--open' : ''}`}
      onClick={onClose}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="bottom-sheet-handle" />
        <div className="bottom-sheet-content">{children}</div>
        {footer && <div className="bottom-sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default BottomSheet;
