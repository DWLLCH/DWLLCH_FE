import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import searchIcon from '../assets/search.svg';
import bookmarkFill from '../assets/bookmark_fill.svg';
import light from '../assets/light.svg';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import BottomNav from '../components/BottomNav';
import useBookmarks from '../hooks/useBookmarks';
import { POLICIES } from '../constants/supportList';
import '../styles/Bookmark.css';

function Bookmark() {
  const navigate = useNavigate();
  const { bookmarkedIds, maxCount } = useBookmarks();
  const [keyword, setKeyword] = useState('');

  const bookmarkedPolicies = useMemo(
    () => POLICIES.filter((policy) => bookmarkedIds.includes(policy.id)),
    [bookmarkedIds],
  );

  const visiblePolicies = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return bookmarkedPolicies;
    return bookmarkedPolicies.filter((policy) => policy.title.includes(trimmed));
  }, [bookmarkedPolicies, keyword]);

  return (
    <div className="bookmark-page">
      <header className="bookmark-header">
        <button
          type="button"
          className="bookmark-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>북마크</h1>
      </header>

      <div className="bookmark-body">
        <div className="bookmark-search-box">
          <input
            className="bookmark-search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="북마크 검색"
            aria-label="북마크 검색"
          />
          <img src={searchIcon} alt="" className="bookmark-search-icon" />
        </div>

        <div className="bookmark-summary">
          <div className="bookmark-summary-row">
            <span className="bookmark-summary-icon">
              <img src={bookmarkFill} alt="" />
            </span>
            <p>
              총 <strong>{bookmarkedPolicies.length}개</strong>의 정책을 북마크했어요
            </p>
          </div>
          <div className="bookmark-summary-row bookmark-summary-row--note">
            <span className="bookmark-summary-icon">
              <img src={light} alt="" />
            </span>
            <p>북마크는 최대 {maxCount}개까지 저장할 수 있어요.</p>
          </div>
        </div>

        {visiblePolicies.length > 0 ? (
          <ul className="bookmark-list">
            {visiblePolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                level={policy.level}
                dday={policy.dday}
                title={policy.title}
                onClick={() => navigate(`/support/${policy.id}`)}
              />
            ))}
          </ul>
        ) : (
          <div className="bookmark-empty">
            <p>
              {bookmarkedPolicies.length === 0
                ? '아직 북마크한 정책이 없어요'
                : '검색 결과가 없어요'}
            </p>
          </div>
        )}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
      <BottomNav />
    </div>
  );
}

export default Bookmark;
