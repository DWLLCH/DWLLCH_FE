import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import useOnboarding from '../hooks/useOnboarding';
import { isValidBirthDate } from '../utils/validators';
import { formatBirthDate } from '../utils/formatters';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

function Onboarding1() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { birthDate } = data;

  const handleChange = (e) => {
    const input = e.target;
    const rawValue = input.value;
    const caret = input.selectionStart ?? rawValue.length;
    const strippedDigits = rawValue.replace(/\D/g, '').slice(0, 8);
    const prevDisplay = formatBirthDate(birthDate);
    if (rawValue.length < prevDisplay.length && strippedDigits.length === birthDate.length) {
      const digitsBeforeCaret = rawValue.slice(0, caret).replace(/\D/g, '').length;
      const removeIndex = Math.max(digitsBeforeCaret - 1, 0);
      updateData({ birthDate: birthDate.slice(0, removeIndex) + birthDate.slice(removeIndex + 1) });
    } else {
      updateData({ birthDate: strippedDigits });
    }
  };

  const isValid = isValidBirthDate(birthDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/2');
  };

  return (
    <div className="onboarding">
      <header className="onboarding-header">
        <button
          type="button"
          className="onboarding-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={arrowRight} alt="" />
        </button>
        <h1>프로필 생성</h1>
      </header>

      <div className="onboarding-progress-wrap">
        <ProgressBar step={1} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <TextField
          id="birthDate"
          name="birthDate"
          label="생년월일"
          placeholder="ex. YYYY.MM.DD"
          value={formatBirthDate(birthDate)}
          onChange={handleChange}
          inputMode="numeric"
          maxLength={10}
        />
        <p className="onboarding-helper">생년월일 8자리를 정확히 입력해주세요.</p>

        <Button type="submit" className="onboarding-next-btn" disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding1;
