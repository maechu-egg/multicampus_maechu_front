import React, { useState } from "react";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";
import BadgeScoreGuide from './badgeModalComponents/BadgeScoreGuide';
import BadgeRankSection from './badgeModalComponents/BadgeRankSection';

interface CrewBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const crewBadgeImages = {
  default: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeDefault.png',
  bronze: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeBronze.png',
  silver: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeSilver.png',
  gold: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeGold.png',
  platinum: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgePlatinum.png',
  diamond: process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeDiamond.png'
};

const getCrewBadgeInfo = (score: number) => {
  if (score >= 100) {
    return {
      currentBadge: "다이아몬드",
      image: crewBadgeImages.diamond,
      nextBadge: null,
      requiredScore: null
    };
  } else if (score >= 70) {
    return {
      currentBadge: "플래티넘",
      image: crewBadgeImages.platinum,
      nextBadge: "다이아몬드",
      requiredScore: 100
    };
  } else if (score >= 50) {
    return {
      currentBadge: "골드",
      image: crewBadgeImages.gold,
      nextBadge: "플래티넘",
      requiredScore: 70
    };
  } else if (score >= 30) {
    return {
      currentBadge: "실버",
      image: crewBadgeImages.silver,
      nextBadge: "골드",
      requiredScore: 50
    };
  } else if (score >= 10) {
    return {
      currentBadge: "브론즈",
      image: crewBadgeImages.bronze,
      nextBadge: "실버",
      requiredScore: 30
    };
  } else {
    return {
      currentBadge: "기본",
      image: crewBadgeImages.default,
      nextBadge: "브론즈",
      requiredScore: 10
    };
  }
};

function CrewBadgeModal({ isOpen, onClose }: CrewBadgeModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState('badge-info');
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [stats, setStats] = useState({
    dietCount: 0,      
    exerciseCount: 0,  
    postCount: 0,      
    commentCount: 0
  });
  const [scoreLeft, setScoreLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const currentBadgeInfo = getCrewBadgeInfo(score);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'badge-info':
        return (
          <>
            <BadgeScoreSection 
              score={score} 
              rank={rank} 
              currentBadge={currentBadgeInfo.currentBadge}
            />
            <div className="stats-footer-container">
              <BadgeStatsSection stats={stats} />
              <BadgeFooterSection 
                scoreLeft={scoreLeft} 
                progress={progress}
                nextBadge={currentBadgeInfo.nextBadge}
              />
            </div>
          </>
        );
      case 'score-guide':  
      return <BadgeScoreGuide isCrew={true} />;
      case 'rank':
        return <BadgeRankSection isCrew={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <BadgeModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'badge-info' && (
          <BadgeModalHeader 
            currentBadge={currentBadgeInfo.currentBadge}
            image={currentBadgeInfo.image}
          />
        )}
        {renderTabContent()}
      </div>
    </div>
  );
}

export default CrewBadgeModal;