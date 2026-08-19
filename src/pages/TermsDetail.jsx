import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import TermsContent from '../components/TermsContent';
import { TERMS_LIST } from '../constants/mypage';
import { TERMS_CONTENT } from '../constants/terms';
import '../styles/AccountChange.css';

function TermsDetail() {
  const navigate = useNavigate();
  const { key } = useParams();
  const matched = TERMS_LIST.find((term) => term.key === key);
  const content = TERMS_CONTENT[key];

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
        <h1>{matched?.label || '약관 및 정책'}</h1>
      </header>

      <div className="account-change-body">
        {content ? (
          <TermsContent sections={content.sections} footer={content.footer} />
        ) : (
          <p className="account-change-helper">내용을 찾을 수 없어요.</p>
        )}
      </div>
    </div>
  );
}

export default TermsDetail;
