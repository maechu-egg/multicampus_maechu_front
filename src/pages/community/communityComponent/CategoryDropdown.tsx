import React, { useState } from 'react';
import categoriesData from '../../../assets/data/categories.json';
import './CategoryDropdown.css';

interface CategoryDropdownProps {
  post_up_sports: string[];
  activeTab: string;
  activePost_sport: string;
  onTabChange: (post_up_sport: string) => void;
  onSubcategoryChange: (post_sport: string) => void;
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
}) => {
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [selectedMain, setSelectedMain] = useState(activeTab);

  // 대분류 선택 처리
  const handleMainCategorySelect = (post_up_sport: string) => {
    setSelectedMain(post_up_sport);
    onTabChange(post_up_sport);
    onSubcategoryChange(""); // 대분류 변경 시 소분류 초기화
    setShowMainDropdown(false);
  };

  // 소분류 선택 처리
  const handleSubCategorySelect = (post_sport: string) => {
    onSubcategoryChange(post_sport);
    setShowSubDropdown(false);
  };

  // 현재 선택된 대분류에 해당하는 소분류 목록 가져오기
  const currentSubCategories = selectedMain ? 
    (categoriesData as CategoriesData).subcategories[selectedMain] || [] 
    : [];

  return (
    <div className="filter-section">
      <div className="dropdowns-container">
        {/* 대분류 드롭다운 */}
        <div className="dropdown-wrapper">
          <button 
            className="dropdown-button main-category"
            onClick={() => setShowMainDropdown(!showMainDropdown)}
          >
            {activeTab || '대분류 선택'} ▼
          </button>
          {showMainDropdown && (
            <div className="dropdown-content">
              {post_up_sports.map((post_up_sport) => (
                <div
                  key={post_up_sport}
                  className={`dropdown-item ${activeTab === post_up_sport ? 'active' : ''}`}
                  onClick={() => handleMainCategorySelect(post_up_sport)}
                >
                  {post_up_sport}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 소분류 드롭다운 */}
        <div className="dropdown-wrapper">
          <button 
            className="dropdown-button sub-category"
            onClick={() => setShowSubDropdown(!showSubDropdown)}
          >
            {activePost_sport || '소분류 선택'} ▼
          </button>
          {showSubDropdown && (
            <div className="dropdown-content">
              <div
                className={`dropdown-item ${activePost_sport === "" ? 'active' : ''}`}
                onClick={() => handleSubCategorySelect("")}
              >
                전체
              </div>
              {currentSubCategories.map((subCategory: string) => (
                <div
                  key={subCategory}
                  className={`dropdown-item ${activePost_sport === subCategory ? 'active' : ''}`}
                  onClick={() => handleSubCategorySelect(subCategory)}
                >
                  {subCategory}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;