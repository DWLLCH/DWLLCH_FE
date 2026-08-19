import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import arrowBottom from '../assets/arrow_bottom.svg';
import arrowUp from '../assets/arrow_up.svg';
import TermsContent from '../components/TermsContent';
import { TERMS_LIST } from '../constants/mypage';
import { TERMS_CONTENT } from '../constants/terms';
import '../styles/AccountChange.css';
import '../styles/Inquiry.css';
import '../styles/TermsList.css';

function TermsList() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
        <h1>약관 및 정책</h1>
      </header>

      <div className="inquiry-body">
        <div className="inquiry-card">
          {TERMS_LIST.map((term) => {
            const isOpen = Boolean(expanded[term.key]);
            const content = TERMS_CONTENT[term.key];
            return (
              <div className="terms-list-group" key={term.key}>
                <button
                  type="button"
                  className="terms-list-row"
                  onClick={() => toggle(term.key)}
                  aria-expanded={isOpen}
                  aria-label={`${term.label} 내용 ${isOpen ? '접기' : '보기'}`}
                >
                  <span>{term.label}</span>
                  <img src={isOpen ? arrowUp : arrowBottom} alt="" className="terms-list-arrow" />
                </button>
                {isOpen && content && (
                  <TermsContent sections={content.sections} footer={content.footer} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TermsList;
