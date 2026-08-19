import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentChecklistContext } from '../components/DocumentChecklistProvider';
import useBookmarks from '../hooks/useBookmarks';
import useFetchOnce from '../hooks/useFetchOnce';
import Toast from '../components/Toast';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginRequiredModal from '../components/LoginRequiredModal';
import backBtn from '../assets/backBtn.svg';
import bookmark from '../assets/bookmark.svg';
import bookmarkEmpty from '../assets/bookmark_empty.svg';
import birdLogo from '../assets/bird_logo.svg';
import link from '../assets/link.svg';
import one from '../assets/one.svg';
import two from '../assets/two.svg';
import three from '../assets/three.svg';
import four from '../assets/four.svg';
import five from '../assets/five.svg';
import PolicyBadges from '../components/PolicyBadges';
import DetailSection from '../components/DetailSection';
import DetailLabel from '../components/DetailLabel';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import ChatbotButton from '../components/ChatbotButton';
import { LEVEL_CONFIG } from '../constants/supportList';
import { getPolicyDetail } from '../api/policy';
import { formatDday, formatDateRangeDots, parseRequiredDocuments } from '../utils/formatters';
import '../styles/PolicyDetail.css';

// 지원 금액/신청 경로처럼 BE가 별도 필드로 안 주는 항목은 아래 문구로 대체 표시함
// (화면 레이아웃은 기존 목업 구조를 최대한 유지하고, 없는 값만 기본 문구로 채움)
const FALLBACK_SUPPORT_AMOUNT = '기관 문의';
const FALLBACK_APPLY_PATH = '기관 홈페이지 → 지원사업 신청';

function PolicyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: policy,
    loading,
    error,
    notFound,
    refetch: fetchPolicy,
  } = useFetchOnce(id, getPolicyDetail);

  const { isBookmarked, toggleBookmark, maxCount } = useBookmarks();
  const { getChecked, toggleChecked } = useContext(DocumentChecklistContext);
  const [toastMessage, setToastMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  if (loading || notFound || error || !policy) {
    return (
      <div className="detail-page">
        <header className="detail-header">
          <button
            type="button"
            className="detail-back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={backBtn} alt="" />
          </button>
          <h1>정책 상세</h1>
        </header>
        <div className="detail-notfound">
          {loading ? (
            <LoadingSpinner />
          ) : notFound ? (
            <p>정책을 찾을 수 없습니다</p>
          ) : (
            <ErrorState message="정책 정보를 불러오지 못했어요" onRetry={fetchPolicy} />
          )}
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(policy.id);

  const documents = parseRequiredDocuments(policy.requiredDocuments);

  const handleToggleBookmark = () => {
    const result = toggleBookmark(policy.id);
    if (result === 'login-required') {
      setShowLoginModal(true);
      return;
    }
    if (result === 'limit-reached') {
      setToastMessage(`북마크는 최대 ${maxCount}개까지 저장할 수 있어요`);
    } else {
      setToastMessage(result === 'added' ? '북마크에 추가했어요' : '북마크가 해제됐어요');
    }
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 1600);
  };

  const handleConsult = () => {
    if (policy.consultLink) {
      window.open(policy.consultLink, '_blank', 'noopener,noreferrer');
    } else if (policy.consultPhone) {
      window.location.href = `tel:${policy.consultPhone}`;
    }
  };

  const checkedDocs = getChecked(policy.id, documents);

  const toggleDoc = (index) => {
    toggleChecked(policy.id, documents, index);
  };

  const missingCount = checkedDocs.filter((checked) => !checked).length;
  // AI 예상 적합도(level)는 아직 BE 응답에 없어서 항상 undefined → PolicyBadges가 배지 없이 안전하게 처리함
  const levelConfig = LEVEL_CONFIG[policy.level];
  const dday = formatDday(policy.applicationEnd);
  const applyPeriodText = formatDateRangeDots(policy.applicationStart, policy.applicationEnd);
  const hasConsultInfo = Boolean(policy.consultLink || policy.consultPhone);

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button
          type="button"
          className="detail-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>{policy.title}</h1>
        <button
          type="button"
          className="detail-bookmark"
          onClick={handleToggleBookmark}
          aria-label="북마크"
          aria-pressed={bookmarked}
        >
          <img src={bookmarked ? bookmark : bookmarkEmpty} alt="" />
        </button>
      </header>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />

      <div className="detail-body">
        <div className="detail-hero">
          <div className="detail-hero-top">
            <div className="detail-hero-text">
              <PolicyBadges level={policy.level} dday={dday} />
              <p className="detail-disclaimer">
                최종 지원 대상 여부는 해당 기관의 심사 결과에 따라 달라질 수 있어요
              </p>
              <p className="detail-hero-title">{policy.title}</p>
            </div>
            <img src={birdLogo} alt="" className="detail-hero-bird" />
          </div>
        </div>

        <DetailSection number={one} title="이 지원사업은?">
          <p className="detail-field-content">{policy.content}</p>
          <div className="detail-info-grid">
            <div className="detail-info-col">
              <p className="detail-info-col-label">지원 내용</p>
              <p className="detail-info-col-value">{policy.summary}</p>
            </div>
            <div className="detail-info-col">
              <p className="detail-info-col-label">지원 금액</p>
              <p className="detail-info-col-value">{FALLBACK_SUPPORT_AMOUNT}</p>
            </div>
            <div className="detail-info-col">
              <p className="detail-info-col-label">신청 기간</p>
              <p className="detail-info-col-value">{applyPeriodText}</p>
            </div>
          </div>
        </DetailSection>

        <DetailSection number={two} title="내가 신청할 수 있나요?">
          <DetailLabel>지원 자격</DetailLabel>
          <div className="detail-eligibility-list">
            <div className="detail-eligibility-item">
              <span className="detail-eligibility-text">{policy.eligibility}</span>
            </div>
          </div>
          <div className="detail-section-buttons">
            <Button variant="blue" fullWidth onClick={() => navigate('/my-info')}>
              내 정보 다시 확인하기
            </Button>
          </div>
        </DetailSection>

        <DetailSection number={three} title="언제 어디서 신청하나요?">
          <div className="detail-field">
            <div className="detail-field-label-row">
              <DetailLabel>신청 기간</DetailLabel>
              {dday && (
                <span
                  className="detail-dday-chip"
                  style={
                    levelConfig
                      ? { backgroundColor: levelConfig.bg, color: levelConfig.color }
                      : undefined
                  }
                >
                  {dday}
                </span>
              )}
            </div>
            <p className="detail-field-content">{applyPeriodText}</p>
          </div>
          <div className="detail-field">
            <DetailLabel>신청 방법</DetailLabel>
            <p className="detail-field-content">{policy.applicationMethod}</p>
          </div>
          <div className="detail-field">
            <DetailLabel>신청 경로</DetailLabel>
            <p className="detail-field-content">{FALLBACK_APPLY_PATH}</p>
          </div>
          <div className="detail-section-buttons">
            <Button
              variant="blue"
              fullWidth
              className="detail-org-btn"
              disabled={!policy.consultLink}
              onClick={() =>
                policy.consultLink &&
                window.open(policy.consultLink, '_blank', 'noopener,noreferrer')
              }
            >
              <span>신청 기관 정보 확인하기</span>
              <img src={link} alt="" />
            </Button>
          </div>
        </DetailSection>

        <DetailSection number={four} title="무엇을 준비해야 하나요?">
          <DetailLabel>준비 서류</DetailLabel>
          <div className="detail-doc-list">
            {documents.map((doc, index) => (
              <div className="detail-doc-item" key={doc.label}>
                <Checkbox
                  id={`doc-${index}`}
                  checked={checkedDocs[index]}
                  onChange={() => toggleDoc(index)}
                  ariaLabel={doc.label}
                />
                <label htmlFor={`doc-${index}`}>{doc.label}</label>
              </div>
            ))}
          </div>
          {missingCount > 0 && (
            <p className="detail-doc-note">AI 확인 결과 아직 {missingCount}개의 서류가 필요해요</p>
          )}
          <div className="detail-section-buttons">
            <Button
              variant="green"
              fullWidth
              onClick={() => navigate(`/support/${policy.id}/documents`)}
            >
              서류 발급 방법 확인하기
            </Button>
          </div>
        </DetailSection>

        <DetailSection number={five} title="도움이 필요하신가요?">
          <div className="detail-section-buttons">
            <Button variant="blue" fullWidth onClick={() => navigate('/chatbot')}>
              AI 챗봇에게 질문하기
            </Button>
            <Button variant="green" fullWidth onClick={() => navigate('/community')}>
              커뮤니티에 물어보기
            </Button>
            <Button variant="green" fullWidth onClick={handleConsult} disabled={!hasConsultInfo}>
              기관 상담 연결
            </Button>
          </div>
        </DetailSection>
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default PolicyDetail;
