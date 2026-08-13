import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import FilterChip from '../components/FilterChip';
import DropdownTrigger from '../components/DropdownTrigger';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import BottomSheet from '../components/BottomSheet';
import SortMenu from '../components/SortMenu';
import Button from '../components/Button';
import { TOTAL_POLICY_COUNT, POLICIES } from '../constants/supportList';
import { FILTER_GROUPS, SORT_OPTIONS } from '../constants/filterOptions';
import '../styles/SupportList.css';

function SupportList() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [draftFilters, setDraftFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);

  const openFilterSheet = () => {
    setDraftFilters(appliedFilters);
    setFilterOpen(true);
  };

  const toggleDraftFilter = (option) => {
    setDraftFilters((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  const removeAppliedFilter = (option) => {
    setAppliedFilters((prev) => prev.filter((item) => item !== option));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
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
            <DropdownTrigger label="필터" onClick={openFilterSheet} />
            <DropdownTrigger label={selectedSort} onClick={() => setSortOpen(true)} />
          </div>
        </div>

        {appliedFilters.length > 0 && (
          <div className="support-filter-chips">
            {appliedFilters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected
                onClick={() => removeAppliedFilter(filter)}
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

      <BottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        footer={
          <div className="filter-sheet-footer">
            <Button variant="gray" className="filter-reset-btn" onClick={() => setDraftFilters([])}>
              초기화
            </Button>
            <Button variant="blue" fullWidth className="filter-apply-btn" onClick={applyFilters}>
              적용하기
            </Button>
          </div>
        }
      >
        {FILTER_GROUPS.map((group) => (
          <div className="filter-sheet-group" key={group.title}>
            <p className="filter-sheet-group-title">{group.title}</p>
            <div className="filter-sheet-group-options">
              {group.options.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={draftFilters.includes(option)}
                  onClick={() => toggleDraftFilter(option)}
                />
              ))}
            </div>
          </div>
        ))}
      </BottomSheet>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)}>
        <SortMenu
          open={sortOpen}
          value={selectedSort}
          options={SORT_OPTIONS}
          onSelect={(option) => {
            setSelectedSort(option);
            setSortOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}

export default SupportList;
