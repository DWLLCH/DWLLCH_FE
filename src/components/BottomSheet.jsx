import { useEffect } from 'react';
import '../styles/BottomSheet.css';

function BottomSheet({ open, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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
