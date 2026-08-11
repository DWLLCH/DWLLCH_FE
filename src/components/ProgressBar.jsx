import { useEffect, useState } from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ step, total, celebrate = false }) {
  const target = (step / total) * 100;
  const [percent, setPercent] = useState(celebrate ? 0 : Math.max(0, ((step - 1) / total) * 100));

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPercent(target);
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <div className={`progress-bar${celebrate ? ' progress-bar--celebrate' : ''}`}>
      <div
        className={`progress-bar-fill${celebrate ? ' progress-bar-fill--celebrate' : ''}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default ProgressBar;
