import React from 'react';
import './RecommendedKeywords.css';

interface RecommendedKeywordsProps {
  keywords: string[];
}

const RecommendedKeywords: React.FC<RecommendedKeywordsProps> = ({ keywords }) => {
  return (
    <div className="recommended-keywords">
      <div className="keyword-list">
        {keywords.slice(0, 5).map((keyword, index) => (
          <span key={index} className="keyword">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecommendedKeywords;