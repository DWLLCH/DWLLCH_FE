import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/LoginRequiredModal.css';

// TODO: 다른 프론트가 작업 중인 공통 에러 모달이 머지되면, 이 임시 모달 디자인은
// 그 공통 모달로 교체할 것 (지금은 머지 전이라 임시로 자체 마크업 사용)
function LoginRequiredModal({ open, onClose, message = '로그인이 필요해요' }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="login-required-backdrop" onClick={onClose}>
      <div className="login-required-modal" onClick={(event) => event.stopPropagation()}>
        <p className="login-required-title">{message}</p>
        <p className="login-required-desc">로그인하고 나의 자립 정보를 확인해보세요</p>
        <div className="login-required-actions">
          <Button variant="gray" onClick={onClose}>
            나중에 할게요
          </Button>
          <Button onClick={() => navigate('/login')}>로그인하러 가기</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
