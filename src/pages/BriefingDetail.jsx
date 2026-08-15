import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import one from '../assets/one.svg';
import two from '../assets/two.svg';
import three from '../assets/three.svg';
import four from '../assets/four.svg';
import five from '../assets/five.svg';
import sparkle from '../assets/sparkle.svg';
import star1 from '../assets/star1.svg';
import star2 from '../assets/star2.svg';
import SectionTag from '../components/SectionTag';
import DetailSection from '../components/DetailSection';
import BriefingLinkChip from '../components/BriefingLinkChip';
import ChatbotButton from '../components/ChatbotButton';
import { BRIEFING_ICONS, getBriefingDetail } from '../constants/briefing';
import '../styles/BriefingDetail.css';

const NUMBER_ICONS = [one, two, three, four, five];

function BriefingDetail() {
  const navigate = useNavigate();
  const { sectionId, cardId } = useParams();
  const detail = getBriefingDetail(sectionId, cardId);
  const bodyRef = useRef(null);
  const hintTimerRef = useRef(null);
  const wasAtBottomRef = useRef(false);
  const [showHint, setShowHint] = useState(false);

  const triggerHint = useCallback(() => {
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowHint(false), 3200);
  }, []);

  useEffect(() => {
    const timer = setTimeout(triggerHint, 800);
    return () => {
      clearTimeout(timer);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [triggerHint]);

  const handleBodyScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
    if (atBottom && !wasAtBottomRef.current) {
      triggerHint();
    }
    wasAtBottomRef.current = atBottom;
  };

  if (!detail) {
    return (
      <div className="briefing-detail-page">
        <header className="briefing-detail-header">
          <button
            type="button"
            className="briefing-detail-back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={backBtn} alt="" />
          </button>
          <h1>AI 브리핑</h1>
        </header>
        <div className="briefing-detail-notfound">
          <p>콘텐츠를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { section, card, description, summary, sections, chatbotHint } = detail;

  return (
    <div className="briefing-detail-page">
      <header className="briefing-detail-header">
        <button
          type="button"
          className="briefing-detail-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>AI 브리핑</h1>
      </header>

      <div className="briefing-detail-body" ref={bodyRef} onScroll={handleBodyScroll}>
        <div className="briefing-detail-hero">
          <div className="briefing-detail-hero-top">
            <div className="briefing-detail-hero-text">
              <SectionTag>{section.title}</SectionTag>
              <p className="briefing-detail-title">{card.title}</p>
              <p className="briefing-detail-desc">
                {description.map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className="briefing-detail-hero-icon">
              <img
                src={BRIEFING_ICONS[card.icon]}
                alt=""
                className="briefing-detail-hero-icon-img"
              />
              <img src={star1} alt="" className="briefing-detail-star briefing-detail-star--1" />
              <img src={star2} alt="" className="briefing-detail-star briefing-detail-star--2" />
            </div>
          </div>

          <div className="briefing-detail-summary">
            <p className="briefing-detail-summary-title">
              <img src={sparkle} alt="" />
              핵심 요약
            </p>
            <ul className="briefing-detail-summary-list">
              {summary.map((item) => (
                <li key={item}>
                  <span className="briefing-detail-check" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {sections.map((sub, index) => (
          <DetailSection
            key={sub.title}
            number={NUMBER_ICONS[Math.min(index, NUMBER_ICONS.length - 1)]}
            title={sub.title}
          >
            {sub.description && <p className="briefing-detail-section-desc">{sub.description}</p>}

            {sub.links && (
              <div className="briefing-detail-links">
                {sub.links.map((label) => (
                  <BriefingLinkChip key={label} label={label} onClick={() => {}} />
                ))}
              </div>
            )}

            {sub.table && (
              <div className="briefing-detail-table">
                <table>
                  <thead>
                    <tr>
                      {sub.table.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sub.table.rows.map((row, rowIndex) => (
                      <tr key={row[0] ?? rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DetailSection>
        ))}
      </div>

      <div
        className={`briefing-detail-chatbot-hint${showHint ? ' briefing-detail-chatbot-hint--visible' : ''}`}
      >
        {chatbotHint}
      </div>
      <ChatbotButton />
    </div>
  );
}

export default BriefingDetail;
