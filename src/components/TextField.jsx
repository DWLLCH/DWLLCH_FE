import { useState } from 'react';
import showIcon from '../assets/show.svg';
import hideIcon from '../assets/hide.svg';
import '../styles/TextField.css';

function TextField({ id, name, label, type = 'text', placeholder, value, onChange, rightElement }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="text-field">
      {label && (
        <label className="text-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="text-field-box">
        <input
          id={id}
          name={name}
          type={inputType}
          className="text-field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        {rightElement
          ? rightElement
          : isPassword && (
              <button
                type="button"
                className="text-field-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <img src={showPassword ? showIcon : hideIcon} alt="" />
              </button>
            )}
      </div>
    </div>
  );
}

export default TextField;
