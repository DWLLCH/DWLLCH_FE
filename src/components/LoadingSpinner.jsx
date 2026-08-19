import '../styles/LoadingSpinner.css';

function LoadingSpinner({ size = 32 }) {
  return (
    <span
      className="loading-spinner"
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  );
}

export default LoadingSpinner;
