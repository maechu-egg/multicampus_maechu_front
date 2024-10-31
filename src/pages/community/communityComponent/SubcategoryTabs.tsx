import React from 'react';
import { Nav } from 'react-bootstrap';
import './SubcategoryTabs.css';


/* 카테고리 소분류 탭을 표시하는 컴포넌트 */
interface SubcategoryTabsProps {
  subcategories: string[];// 서브카테고리 목록 배열
  activeSubcategory: string; // 현재 선택된 서브카테고리
  onSubcategoryChange: (subcategory: string) => void; // 서브카테고리 변경 핸들러
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Nav variant="pills" className="subcategory-tabs">
        {/* 소분류 전체 */}
        <Nav.Item>
          <Nav.Link
            active={activeSubcategory === ""}
            onClick={() => onSubcategoryChange("")}
          >
            전체
          </Nav.Link>
        </Nav.Item>
        {/* 카테고리 소분류 목록 */}
        {subcategories.map((subcategory) => (
          <Nav.Item key={subcategory}>
            <Nav.Link
              active={activeSubcategory === subcategory}
              onClick={() => onSubcategoryChange(subcategory)}
            >
              {subcategory}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default SubcategoryTabs;