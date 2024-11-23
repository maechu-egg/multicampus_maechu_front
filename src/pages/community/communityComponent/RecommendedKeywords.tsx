import React from 'react';
import './RecommendedKeywords.css';

interface RecommendedKeywordsProps {
  keywords: string[];
}

interface RecommendedKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

const RecommendedKeywords: React.FC<RecommendedKeywordsProps> = ({ keywords, onKeywordClick }) => {
  return (
    <div className="recommended-keywords">
       <div className="keyword-list">
      {keywords.map((keyword, index) => (
        <button className="keyword" key={index} onClick={() => onKeywordClick(keyword)}>
          {keyword}
        </button>
      ))}
      </div>
    </div>
  );
};

export default RecommendedKeywords;