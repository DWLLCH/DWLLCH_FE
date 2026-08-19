import { useEffect, useState } from 'react';
import '../styles/Toast.css';

const EXIT_DURATION = 300;

function Toast({ message, visible, variant = 'default' }) {
  const [shouldRender, setShouldRender] = useState(visible);
  const [closing, setClosing] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setClosing(false);
      setDisplayMessage(message);
      return undefined;
    }

    if (!shouldRender) return undefined;

    setClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setClosing(false);
    }, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [visible, shouldRender, message]);

  if (!shouldRender) return null;

  return (
    <div
      className={`toast${variant === 'warning' ? ' toast--warning' : ''}${closing ? ' toast--closing' : ''}`}
      role="status"
    >
      {visible ? message : displayMessage}
    </div>
  );
}

export default Toast;
