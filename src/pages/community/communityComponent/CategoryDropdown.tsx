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
  const defaultCategory = "헬스 및 피트니스";
  const [selectedMain, setSelectedMain] = useState(activeTab || defaultCategory);
  const [isOpen, setIsOpen] = useState(true);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");

  const handleMainCategorySelect = (post_up_sport: string) => {
    setSelectedMain(post_up_sport);
    onTabChange(post_up_sport);
    onSubcategoryChange(""); 
    setSelectedKeyword(""); // 카테고리 선택 시 키워드 선택 초기화
  };

  const handleSubCategorySelect = (post_sport: string) => {
    onSubcategoryChange(post_sport);
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setSelectedMain(""); // 키워드 선택 시 카테고리 선택 초기화
    onKeywordClick(keyword);
  };
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setMaxHeight(!isOpen ? '300px' : '0px');
  };
  React.useEffect(() => {
    if (!activeTab) {
      onTabChange(defaultCategory);
      onSubcategoryChange(""); // 상세 카테고리는 '전체' 선택
    }
  }, []);
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
                  className={`category-item ${selectedKeyword === "" && activeTab === post_up_sport ? 'active' : ''}`}
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
                    className={`keyword ${selectedKeyword === keyword ? 'active' : ''}`}
                    onClick={() => handleKeywordClick(keyword)}
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