import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import FilterChip from '../components/FilterChip';
import DropdownTrigger from '../components/DropdownTrigger';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import { TOTAL_POLICY_COUNT, ACTIVE_FILTERS, POLICIES } from '../constants/supportList';
import '../styles/SupportList.css';

function SupportList() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState(ACTIVE_FILTERS);

  const removeFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((item) => item !== filter));
  };

  return (
    <div className="support-page">
      <header className="support-header">
        <button
          type="button"
          className="support-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>제도 한눈에보기</h1>
      </header>

      <div className="support-body">
        <div className="support-toolbar">
          <div className="support-count">{TOTAL_POLICY_COUNT} 개의 정책</div>
          <div className="support-toolbar-actions">
            <DropdownTrigger label="필터" onClick={() => {}} />
            <DropdownTrigger label="정렬" onClick={() => {}} />
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="support-filter-chips">
            {activeFilters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected
                onClick={() => removeFilter(filter)}
              />
            ))}
          </div>
        )}

        <ul className="support-list">
          {POLICIES.map((policy) => (
            <PolicyCard
              key={policy.id}
              level={policy.level}
              dday={policy.dday}
              title={policy.title}
              onClick={() => navigate(`/support/${policy.id}`)}
            />
          ))}
        </ul>
      </div>

      <ChatbotButton />
    </div>
  );
}

export default SupportList;
