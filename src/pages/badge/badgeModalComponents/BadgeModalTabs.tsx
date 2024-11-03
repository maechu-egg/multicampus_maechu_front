import React from 'react';
import './BadgeModalTabs.css';

interface BadgeModalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function BadgeModalTabs({ activeTab, onTabChange }: BadgeModalTabsProps) {
  return (
    <div className="badge-modal-tabs">
      <button 
        className={`tab-button ${activeTab === 'badge-info' ? 'active' : ''}`}
        onClick={() => onTabChange('badge-info')}
      >
        뱃지 정보
      </button>
      <button 
        className={`tab-button ${activeTab === 'score-guide' ? 'active' : ''}`}  // achievement를 score-guide로 변경
        onClick={() => onTabChange('score-guide')}  // achievement를 score-guide로 변경
      >
        점수 설명
      </button>
      <button 
        className={`tab-button ${activeTab === 'rank' ? 'active' : ''}`}  // history를 rank로 변경
        onClick={() => onTabChange('rank')}  // history를 rank로 변경
      >
        순위
      </button>
    </div>
  );
}

export default BadgeModalTabs;