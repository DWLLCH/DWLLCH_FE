import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import Button from '../components/Button';
import SocialLoginButton from '../components/SocialLoginButton';
import { login, setTokens } from '../api/auth';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { accessToken, refreshToken } = await login(form);
      setTokens({ accessToken, refreshToken });
      navigate('/home');
    } catch (error) {
      const message = error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      {/* 헤더 */}
      <header className="login-header">
        <h1>로그인</h1>
      </header>

      <form className="login-body" onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          label="이메일"
          type="email"
          placeholder="메일 주소를 입력해주세요"
          value={form.email}
          onChange={handleChange}
          autoComplete="username"
        />
        <TextField
          id="password"
          name="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>

        {/* 소셜 로그인 */}
        <div className="login-divider">
          <span>또는</span>
        </div>
        <SocialLoginButton label="Google로 시작하기" />

        {/* 하단 링크 */}
        <div className="login-links">
          <Link to="/find-password" className="login-forgot">
            비밀번호를 잊으셨나요?
          </Link>
          <p className="login-signup">
            아직 Fledge 회원이 아니신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
