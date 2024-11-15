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
  showKeywords?: boolean;
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
  showKeywords = true,
}) => {
  const [selectedMain, setSelectedMain] = useState(activeTab);
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');

  const handleMainCategorySelect = (post_up_sport: string) => {
    setSelectedMain(post_up_sport);
    onTabChange(post_up_sport);
    onSubcategoryChange(""); 
  };

  const handleSubCategorySelect = (post_sport: string) => {
    onSubcategoryChange(post_sport);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setMaxHeight(!isOpen ? '300px' : '0px');
  };

  const currentSubCategories = selectedMain ? 
    (categoriesData as CategoriesData).subcategories[selectedMain] || [] 
    : [];

  return (
    <div className="filter-section">
      <div className="section-headers">
        <div className="header-item">카테고리 선택</div>
        <div className="header-item">상세 카테고리</div>
        {showKeywords && <div className="header-item">추천 키워드</div>}
        <button 
          className="toggle-button"
          onClick={handleToggle}
        >
          {isOpen ? '▼' : '▲'}
        </button>
      </div>

      <div className="filter-container" style={{ maxHeight: maxHeight }}>
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

        {showKeywords && (
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
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;