import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentChecklistContext } from '../components/DocumentChecklistProvider';
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
import StatusChip from '../components/StatusChip';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import ChatbotButton from '../components/ChatbotButton';
import { POLICIES, LEVEL_CONFIG } from '../constants/supportList';
import { getPolicyDetail } from '../constants/policyDetail';
import '../styles/PolicyDetail.css';

function PolicyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const policy = POLICIES.find((item) => item.id === Number(id)) || POLICIES[0];
  const detail = getPolicyDetail(policy.id);

  const [bookmarked, setBookmarked] = useState(false);
  const { getChecked, toggleChecked } = useContext(DocumentChecklistContext);
  const checkedDocs = getChecked(policy.id, detail.documents);

  const toggleDoc = (index) => {
    toggleChecked(policy.id, detail.documents, index);
  };

  const missingCount = checkedDocs.filter((checked) => !checked).length;
  const levelConfig = LEVEL_CONFIG[policy.level];

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
          onClick={() => setBookmarked((prev) => !prev)}
          aria-label="북마크"
          aria-pressed={bookmarked}
        >
          <img src={bookmarked ? bookmark : bookmarkEmpty} alt="" />
        </button>
      </header>

      <div className="detail-body">
        <div className="detail-hero">
          <div className="detail-hero-top">
            <div className="detail-hero-text">
              <PolicyBadges level={policy.level} dday={policy.dday} />
              <p className="detail-disclaimer">{detail.disclaimer}</p>
              <p className="detail-hero-title">{policy.title}</p>
              <p className="detail-hero-desc">
                현재 입력하신 정보 기준
                <br />
                주요 요건을 충족해요
              </p>
            </div>
            <img src={birdLogo} alt="" className="detail-hero-bird" />
          </div>
        </div>

        <DetailSection number={one} title="이 지원사업은?">
          <p className="detail-field-content">{detail.summary}</p>
          <div className="detail-info-grid">
            {detail.supportInfo.map((info) => (
              <div className="detail-info-col" key={info.label}>
                <p className="detail-info-col-label">{info.label}</p>
                <p className="detail-info-col-value">{info.value}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection number={two} title="내가 신청할 수 있나요?">
          <DetailLabel>지원 자격</DetailLabel>
          <div className="detail-eligibility-list">
            {detail.eligibility.map((item) => (
              <div className="detail-eligibility-item" key={item.text}>
                <span className="detail-eligibility-text">{item.text}</span>
                <span className="detail-eligibility-status">
                  {item.status && <StatusChip status={item.status} />}
                </span>
              </div>
            ))}
          </div>
          <div className="detail-section-buttons">
            <Button variant="blue" fullWidth onClick={() => {}}>
              내 정보 다시 확인하기
            </Button>
          </div>
        </DetailSection>

        <DetailSection number={three} title="언제 어디서 신청하나요?">
          <div className="detail-field">
            <div className="detail-field-label-row">
              <DetailLabel>신청 기간</DetailLabel>
              <span
                className="detail-dday-chip"
                style={{ backgroundColor: levelConfig.bg, color: levelConfig.color }}
              >
                {policy.dday}
              </span>
            </div>
            <p className="detail-field-content">{detail.applyPeriod}</p>
          </div>
          <div className="detail-field">
            <DetailLabel>신청 방법</DetailLabel>
            <p className="detail-field-content">
              {detail.applyMethod.before}
              {detail.applyMethod.linkUrl && (
                <a
                  className="detail-field-link"
                  href={detail.applyMethod.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {detail.applyMethod.linkLabel}
                </a>
              )}
              {detail.applyMethod.after}
            </p>
          </div>
          <div className="detail-field">
            <DetailLabel>신청 경로</DetailLabel>
            <p className="detail-field-content">{detail.applyPath}</p>
          </div>
          <div className="detail-section-buttons">
            <Button
              variant="blue"
              fullWidth
              className="detail-org-btn"
              onClick={() =>
                detail.orgUrl && window.open(detail.orgUrl, '_blank', 'noopener,noreferrer')
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
            {detail.documents.map((doc, index) => (
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
            <Button variant="blue" fullWidth onClick={() => {}}>
              AI 챗봇에게 질문하기
            </Button>
            <Button variant="green" fullWidth onClick={() => {}}>
              커뮤니티에 물어보기
            </Button>
            <Button variant="green" fullWidth onClick={() => {}}>
              기관 상담 연결
            </Button>
          </div>
        </DetailSection>
      </div>

      <ChatbotButton />
    </div>
  );
}

export default PolicyDetail;
