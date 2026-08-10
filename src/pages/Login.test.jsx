import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

test('로그인 화면의 주요 요소가 보인다', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Login />
    </MemoryRouter>,
  );
  expect(screen.getByText('이메일')).toBeInTheDocument();
  expect(screen.getByText('비밀번호')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  expect(screen.getByText('Google로 시작하기')).toBeInTheDocument();
});
