import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { isValidBirthDate } from '../utils/validators';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

function Onboarding1() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
    setBirthDate(digitsOnly);
  };

  const isValid = isValidBirthDate(birthDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/2', { state: { birthDate } });
  };

  return (
    <div className="onboarding">
      <header className="onboarding-header">
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
          value={birthDate}
          onChange={handleChange}
          inputMode="numeric"
          maxLength={8}
        />
        <p className="onboarding-helper">생년월일 8자리를 정확히 입력해주세요.</p>

        <Button type="submit" fullWidth disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding1;
