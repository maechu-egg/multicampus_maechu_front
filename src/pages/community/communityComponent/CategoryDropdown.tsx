import React, { useState } from 'react';
import categoriesData from '../../../assets/data/categories.json';
import './CategoryDropdown.css';

interface CategoryDropdownProps {
  post_up_sports: string[];
  activeTab: string;
  activePost_sport: string;
  onTabChange: (post_up_sport: string) => void;
  onSubcategoryChange: (post_sport: string) => void;
  recommendedKeywords: string[];
  onKeywordClick: (keyword: string) => void;
}

interface CategoriesData {
  categories: string[];
  subcategories: {
    [key: string]: string[];
  };
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  post_up_sports,
  activeTab,
  activePost_sport,
  onTabChange,
  onSubcategoryChange,
  recommendedKeywords,
  onKeywordClick,
}) => {
  const [selectedMain, setSelectedMain] = useState(activeTab);
  const [isOpen, setIsOpen] = useState(true);

  // 대분류 선택 처리
  const handleMainCategorySelect = (post_up_sport: string) => {
    setSelectedMain(post_up_sport);
    onTabChange(post_up_sport);
    onSubcategoryChange(""); // 대분류 변경 시 소분류 초기화
  };

  // 소분류 선택 처리
  const handleSubCategorySelect = (post_sport: string) => {
    onSubcategoryChange(post_sport);
  };

  // 현재 선택된 대분류에 해당하는 소분류 목록 가져오기
  const currentSubCategories = selectedMain ? 
    (categoriesData as CategoriesData).subcategories[selectedMain] || [] 
    : [];

  return (
    <div className="filter-section">
      {/* 헤더 섹션 */}
      <div className="section-headers">
        <div className="header-item">카테고리 선택</div>
        <div className="header-item">상세 카테고리</div>
        <div className="header-item">추천 키워드</div>
        <button 
          className="toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▼' : '▲'}
        </button>
      </div>

      {/* 컨텐츠 섹션 */}
      {isOpen && (
        <div className="filter-container">
          {/* 대분류 섹션 */}
          <div className="category-section main-category">
            <div className="category-list">
              {post_up_sports.map((post_up_sport) => (
                <div
                  key={post_up_sport}
                  className={`category-item ${activeTab === post_up_sport ? 'active' : ''}`}
                  onClick={() => handleMainCategorySelect(post_up_sport)}
                >
                  {post_up_sport}
                </div>
              ))}
            </div>
          </div>

          {/* 소분류 섹션 */}
          <div className="category-section sub-category">
            <div className="category-list">
              <div
                className={`category-item ${activePost_sport === "" ? 'active' : ''}`}
                onClick={() => handleSubCategorySelect("")}
              >
                전체
              </div>
              {currentSubCategories.map((subCategory: string) => (
                <div
                  key={subCategory}
                  className={`category-item ${activePost_sport === subCategory ? 'active' : ''}`}
                  onClick={() => handleSubCategorySelect(subCategory)}
                >
                  {subCategory}
                </div>
              ))}
            </div>
          </div>

          {/* 키워드 섹션 */}
          <div className="category-section keyword-section">
            <div className="keyword-list">
              {recommendedKeywords.map((keyword, index) => (
                <button 
                  key={index}
                  className="keyword"
                  onClick={() => onKeywordClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;