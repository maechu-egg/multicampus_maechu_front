import React from 'react';
import { Nav } from 'react-bootstrap';
import './CategoryTabs.css';

/* 메인 카테고리 탭을 표시하는 컴포넌트 */

interface CategoryTabsProps {
  post_up_sports: string[]; // 카테고리 목록 배열
  activeTab: string; // 현재 활성화된 카테고리
  onTabChange: (post_up_sport: string) => void; // 카테고리 변경 핸들러
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  post_up_sports,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="d-flex justify-content-center">
      <Nav variant="tabs" className="category-tabs">
        {post_up_sports.map((post_up_sport) => (
          <Nav.Item key={post_up_sport}>
            <Nav.Link
              active={activeTab === post_up_sport}
              onClick={() => onTabChange(post_up_sport)}
            >
              {post_up_sport}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default CategoryTabs;