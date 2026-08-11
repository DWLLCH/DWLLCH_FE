import { useEffect, useState } from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ step, total }) {
  const [percent, setPercent] = useState(Math.max(0, ((step - 1) / total) * 100));

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPercent((step / total) * 100);
    });
    return () => cancelAnimationFrame(frame);
  }, [step, total]);

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}

export default ProgressBar;
