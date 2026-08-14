import arrowBottom from '../assets/arrow_bottom.svg';
import '../styles/DropdownTrigger.css';

function DropdownTrigger({ label, onClick }) {
  return (
    <button type="button" className="dropdown-trigger" onClick={onClick}>
      {label}
      <img src={arrowBottom} alt="" />
    </button>
  );
}

export default DropdownTrigger;
