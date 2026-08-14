import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import BottomNav from '../components/BottomNav';
import CategoryChip from '../components/CategoryChip';
import CommunityPostCard from '../components/CommunityPostCard';
import WriteFabButton from '../components/WriteFabButton';
import { CATEGORIES, NOTICE_POST, POSTS } from '../constants/community';
import '../styles/Community.css';

function Community() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('최신');

  const filteredPosts =
    activeCategory === '최신' ? POSTS : POSTS.filter((post) => post.category === activeCategory);

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const visiblePosts = [
    ...sortedPosts.filter((post) => post.badge === 'hot'),
    ...sortedPosts.filter((post) => post.badge !== 'hot'),
  ];

  return (
    <div className="community-page">
      <header className="community-header">
        <button
          type="button"
          className="community-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>커뮤니티</h1>
      </header>

      <div className="community-tabs">
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      <div className="community-body">
        <ul className="community-post-list">
          <CommunityPostCard
            badge={NOTICE_POST.badge}
            title={NOTICE_POST.title}
            description={NOTICE_POST.description}
            author={NOTICE_POST.author}
            time={NOTICE_POST.time}
            onClick={() => {}}
          />
          {visiblePosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              badge={post.badge}
              title={post.title}
              description={post.description}
              author={post.author}
              time={post.time}
              thumbnail={post.thumbnail}
              onClick={() => {}}
            />
          ))}
        </ul>
      </div>

      <WriteFabButton onClick={() => {}} />
      <BottomNav />
    </div>
  );
}

export default Community;
