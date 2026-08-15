import pencil from '../assets/pencil.svg';
import '../styles/WriteFabButton.css';

function WriteFabButton({ onClick }) {
  return (
    <button type="button" className="write-fab" onClick={onClick} aria-label="글쓰기">
      <img src={pencil} alt="" />
    </button>
  );
}

export default WriteFabButton;
