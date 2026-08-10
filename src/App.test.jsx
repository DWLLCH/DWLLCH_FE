import { render, screen } from '@testing-library/react';
import App from './App';

test('스플래시 화면의 로고가 보인다', () => {
  render(<App />);
  const logo = screen.getByAltText('로고');
  expect(logo).toBeInTheDocument();
});
