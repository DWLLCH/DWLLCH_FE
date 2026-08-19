import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import { INQUIRY_TYPES } from '../constants/mypage';
import '../styles/AccountChange.css';
import '../styles/Inquiry.css';

function InquiryDetail() {
  const navigate = useNavigate();
  const { type } = useParams();
  const isHistory = type === 'history';
  const matchedType = INQUIRY_TYPES.find((item) => item.key === type);
  const title = isHistory ? '문의 내역' : matchedType?.label || '문의하기';

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
        <h1>{title}</h1>
      </header>

      <div className="inquiry-empty">
        {isHistory ? (
          <p>아직 등록된 문의 내역이 없어요.</p>
        ) : (
          <p>
            아직 준비 중인 화면이에요.
            <br />
            빠른 시일 내에 만나볼 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
}

export default InquiryDetail;
