import '../styles/Toast.css';

function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
}

export default Toast;
