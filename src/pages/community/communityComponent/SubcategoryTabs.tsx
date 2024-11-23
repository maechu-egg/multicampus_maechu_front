import React from 'react';
import { Nav } from 'react-bootstrap';
import './SubcategoryTabs.css';


/* 카테고리 소분류 탭을 표시하는 컴포넌트 */
interface SubcategoryTabsProps {
  post_sports: string[];// 서브카테고리 목록 배열
  activePost_sport: string; // 현재 선택된 서브카테고리
  onSubcategoryChange: (post_sport: string) => void; // 서브카테고리 변경 핸들러
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({
  post_sports,
  activePost_sport,
  onSubcategoryChange,
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Nav variant="pills" className="subcategory-tabs">
        {/* 소분류 전체 */}
        <Nav.Item>
          <Nav.Link
            active={activePost_sport === ""}
            onClick={() => onSubcategoryChange("")}
          >
            전체
          </Nav.Link>
        </Nav.Item>
        {/* 카테고리 소분류 목록 */}
        {post_sports.map((post_sport) => (
          <Nav.Item key={post_sport}>
            <Nav.Link
              active={activePost_sport === post_sport}
              onClick={() => onSubcategoryChange(post_sport)}
            >
              {post_sport}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default SubcategoryTabs;