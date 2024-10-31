import React from 'react';
import { Nav } from 'react-bootstrap';
import './CategoryTabs.css';

/* 메인 카테고리 탭을 표시하는 컴포넌트 */

interface CategoryTabsProps {
  categories: string[]; // 카테고리 목록 배열
  activeTab: string; // 현재 활성화된 카테고리
  onTabChange: (category: string) => void; // 카테고리 변경 핸들러
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="d-flex justify-content-center">
      <Nav variant="tabs" className="category-tabs">
        {categories.map((category) => (
          <Nav.Item key={category}>
            <Nav.Link
              active={activeTab === category}
              onClick={() => onTabChange(category)}
            >
              {category}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default CategoryTabs;