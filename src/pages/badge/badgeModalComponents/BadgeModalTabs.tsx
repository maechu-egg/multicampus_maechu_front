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
        className={`tab-button ${activeTab === 'achievement' ? 'active' : ''}`}
        onClick={() => onTabChange('achievement')}
      >
        점수 설명
      </button>
      <button 
        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        순위
      </button>
    </div>
  );
}

export default BadgeModalTabs;