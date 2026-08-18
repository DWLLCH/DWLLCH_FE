import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import documentIcon from '../assets/document.svg';
import Checkbox from '../components/Checkbox';
import DocumentCard from '../components/DocumentCard';
import ChatbotButton from '../components/ChatbotButton';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { DocumentChecklistContext } from '../components/DocumentChecklistProvider';
import { getPolicyDetail } from '../api/policy';
import { parseRequiredDocuments } from '../utils/formatters';
import '../styles/DocumentGuide.css';

function DocumentGuide() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { getChecked, toggleChecked } = useContext(DocumentChecklistContext);

  // StrictMode 개발 모드에서 effect가 두 번 실행되는 걸 막는 가드 (PolicyDetail.jsx와 동일한 패턴)
  const fetchedPolicyIdRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchPolicy = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(false);
    setNotFound(false);
    getPolicyDetail(id)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setPolicy(data);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        if (err.response?.status === 404) setNotFound(true);
        else setError(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (fetchedPolicyIdRef.current === id) return;
    fetchedPolicyIdRef.current = id;
    fetchPolicy();
  }, [id, fetchPolicy]);

  if (loading || notFound || error || !policy) {
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
        <div className="doc-guide-notfound">
          {loading ? (
            <LoadingSpinner />
          ) : notFound ? (
            <p>정책을 찾을 수 없습니다</p>
          ) : (
            <ErrorState message="서류 정보를 불러오지 못했어요" onRetry={fetchPolicy} />
          )}
        </div>
      </div>
    );
  }

  const documents = parseRequiredDocuments(policy.requiredDocuments);
  const checkedDocs = getChecked(policy.id, documents);
  const toggleDoc = (index) => toggleChecked(policy.id, documents, index);

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

        {documents.length === 0 ? (
          <p className="doc-guide-empty">등록된 준비 서류가 없어요</p>
        ) : (
          <>
            <div className="doc-guide-status">
              <p className="doc-guide-status-title">준비 현황</p>
              <div className="doc-guide-status-grid">
                {documents.map((doc, index) => (
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
              {documents.map((doc, index) => (
                <DocumentCard
                  key={doc.label}
                  number={index + 1}
                  title={doc.label}
                  checked={checkedDocs[index]}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
    </div>
  );
}

export default DocumentGuide;
