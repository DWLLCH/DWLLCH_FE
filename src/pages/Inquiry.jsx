import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import SettingsRow from '../components/SettingsRow';
import { INQUIRY_TYPES } from '../constants/mypage';
import '../styles/AccountChange.css';
import '../styles/Inquiry.css';

function Inquiry() {
  const navigate = useNavigate();

  return (
    <div className="account-change-page">
      <header className="account-change-header">
        <button
          type="button"
          className="account-change-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>문의하기</h1>
      </header>

      <div className="inquiry-body">
        <p className="inquiry-section-title">문의 유형을 선택해 주세요.</p>
        <div className="inquiry-card">
          {INQUIRY_TYPES.map((type) => (
            <SettingsRow
              key={type.key}
              label={type.label}
              chevron
              onClick={() => navigate(`/mypage/inquiry/${type.key}`)}
            />
          ))}
        </div>

        <div className="inquiry-history-block">
          <p className="inquiry-section-title">문의 내역</p>
          <p className="inquiry-section-desc">작성한 문의 내역을 확인할 수 있어요.</p>
          <div className="inquiry-card">
            <SettingsRow
              label="문의 내역 확인하기"
              chevron
              onClick={() => navigate('/mypage/inquiry/history')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inquiry;
