import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import documentIcon from '../assets/document.svg';
import Checkbox from '../components/Checkbox';
import DocumentCard from '../components/DocumentCard';
import ChatbotButton from '../components/ChatbotButton';
import { DocumentChecklistContext } from '../components/DocumentChecklistProvider';
import { POLICIES } from '../constants/supportList';
import { getPolicyDetail } from '../constants/policyDetail';
import '../styles/DocumentGuide.css';

function DocumentGuide() {
  const navigate = useNavigate();
  const { id } = useParams();
  const policy = POLICIES.find((item) => item.id === Number(id)) || POLICIES[0];
  const detail = getPolicyDetail(policy.id);

  const { getChecked, toggleChecked } = useContext(DocumentChecklistContext);
  const checkedDocs = getChecked(policy.id, detail.documents);
  const toggleDoc = (index) => toggleChecked(policy.id, detail.documents, index);

  const readyCount = checkedDocs.filter(Boolean).length;
  const pendingCount = checkedDocs.length - readyCount;

  return (
    <div className="doc-guide-page">
      <header className="doc-guide-header">
        <button
          type="button"
          className="doc-guide-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>서류 준비 가이드</h1>
      </header>

      <div className="doc-guide-body">
        <div className="doc-guide-intro">
          <img src={documentIcon} alt="" className="doc-guide-intro-icon" />
          <div>
            <p className="doc-guide-intro-title">필요한 서류를 어떻게 준비하는지 알려드릴게요.</p>
            <p className="doc-guide-intro-desc">
              서류별 발급 방법과 준비 여부를 한눈에 확인할 수 있어요.
            </p>
          </div>
        </div>

        <div className="doc-guide-status">
          <p className="doc-guide-status-title">준비 현황</p>
          <div className="doc-guide-status-grid">
            {detail.documents.map((doc, index) => (
              <div className="doc-guide-status-item" key={doc.label}>
                <Checkbox
                  id={`doc-status-${index}`}
                  checked={checkedDocs[index]}
                  onChange={() => toggleDoc(index)}
                  ariaLabel={doc.label}
                />
                <label htmlFor={`doc-status-${index}`}>{doc.label}</label>
              </div>
            ))}
          </div>
          <div className="doc-guide-status-summary">
            <span className="doc-guide-status-summary-item">
              <span className="doc-guide-status-dot doc-guide-status-dot--done" />
              준비 완료 {readyCount}
            </span>
            <span className="doc-guide-status-summary-item">
              <span className="doc-guide-status-dot doc-guide-status-dot--todo" />
              발급 필요/미준비 {pendingCount}
            </span>
          </div>
        </div>

        <div className="doc-guide-card-list">
          {detail.documents.map((doc, index) => (
            <DocumentCard
              key={doc.label}
              number={index + 1}
              title={doc.label}
              description={doc.description}
              checked={checkedDocs[index]}
              issueMethod={doc.issueMethod}
              preparation={doc.preparation}
              linkLabel={doc.linkLabel}
              linkUrl={doc.linkUrl}
            />
          ))}
        </div>
      </div>

      <ChatbotButton />
    </div>
  );
}

export default DocumentGuide;
