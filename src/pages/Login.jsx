import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '../components/TextField';
import Button from '../components/Button';
import SocialLoginButton from '../components/SocialLoginButton';
import '../styles/Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        />
        <TextField
          id="password"
          name="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth>
          로그인
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
