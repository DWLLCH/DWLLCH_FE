import '../styles/ErrorState.css';

function ErrorState({ message, onRetry, retryLabel = '다시 시도하기', dim = false }) {
  const content = (
    <div className="error-state" role="alert">
      <span className="error-state-icon" aria-hidden="true">
        !
      </span>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button type="button" className="error-state-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );

  if (!dim) return content;

  return <div className="error-state-backdrop">{content}</div>;
}

export default ErrorState;
