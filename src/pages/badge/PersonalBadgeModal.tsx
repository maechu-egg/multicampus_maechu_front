import React, { useEffect, useState } from "react";
import axios from "axios";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";

interface PersonalBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserStats {
  workoutDays: number;
  dietDays: number;
  posts: number;
  comments: number;
}

const badgeImages = {
  default: process.env.PUBLIC_URL + '/img/personalBadge/badgeDefault.png',
  bronze: process.env.PUBLIC_URL + '/img/personalBadge/badgeBronze.png',
  silver: process.env.PUBLIC_URL + '/img/personalBadge/badgeSilver.png',
  gold: process.env.PUBLIC_URL + '/img/personalBadge/badgeGold.png',
  platinum: process.env.PUBLIC_URL + '/img/personalBadge/badgePlatinum.png',
  diamond: process.env.PUBLIC_URL + '/img/personalBadge/badgeDiamond.png'
};

const getBadgeInfo = (score: number) => {
  if (score >= 100) {
    return {
      currentBadge: "다이아몬드",  
      image: badgeImages.diamond,
      nextBadge: null,
      requiredScore: null
    };
  } else if (score >= 70) {
    return {
      currentBadge: "플래티넘",    
      image: badgeImages.platinum,
      nextBadge: "다이아몬드",
      requiredScore: 100
    };
  } else if (score >= 50) {
    return {
      currentBadge: "골드",        
      image: badgeImages.gold,
      nextBadge: "플래티넘",
      requiredScore: 70
    };
  } else if (score >= 30) {
    return {
      currentBadge: "실버",       
      image: badgeImages.silver,
      nextBadge: "골드",
      requiredScore: 50
    };
  } else if (score >= 10) {
    return {
      currentBadge: "브론즈",     
      image: badgeImages.bronze,
      nextBadge: "실버",
      requiredScore: 30
    };
  } else {
    return {
      currentBadge: "기본",        
      image: badgeImages.default,
      nextBadge: "브론즈",
      requiredScore: 10
    };
  }
};

function PersonalBadgeModal({ isOpen, onClose }: PersonalBadgeModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState('badge-info');
  const [badge, setBadge] = useState("플래티넘");
  const [score, setScore] = useState(40);
  const [rank, setRank] = useState("30.5%");
  const [stats, setStats] = useState({ workoutDays: 20, dietDays: 30, posts: 10, comments: 15 });
  const [scoreLeft, setScoreLeft] = useState(20);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    if (isOpen) {
      axios.get("/api/personal-badge")
        .then(response => {
          const { score, rank, stats } = response.data;
          setScore(score);
          setRank(rank);
          setStats(stats);
          
          // 점수에 따른 뱃지 정보 설정
          const badgeInfo = getBadgeInfo(score);
          
          // 다음 등급까지 남은 점수 계산
          if (badgeInfo.requiredScore) {
            const remainingScore = badgeInfo.requiredScore - score;
            setScoreLeft(remainingScore);
            // 현재 점수부터 다음 등급까지의 진행률 계산
            const currentThreshold = getBadgeThreshold(score);
            const progressPercentage = ((score - currentThreshold) / (badgeInfo.requiredScore - currentThreshold)) * 100;
            setProgress(progressPercentage);
          } else {
            // 최고 등급인 경우
            setScoreLeft(0);
            setProgress(100);
          }
        })
        .catch(error => console.error("Failed to fetch data", error));
    }
  }, [isOpen]);
  // 현재 점수가 속한 등급의 최소 점수를 반환하는 함수
const getBadgeThreshold = (score: number) => {
  if (score >= 100) return 100;
  if (score >= 70) return 70;
  if (score >= 50) return 50;
  if (score >= 30) return 30;
  if (score >= 10) return 10;
  return 0;
};

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'badge-info':
        return (
          <>
            <BadgeScoreSection score={score} rank={rank} />
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
      case 'achievement':
        return (
          <div className="achievement-content">
            <p>업적 내용이 들어갈 자리입니다.</p>
          </div>
        );
      case 'history':
        return (
          <div className="history-content">
            <p>히스토리 내용이 들어갈 자리입니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  // 현재 점수에 따른 뱃지 정보 가져오기
  const currentBadgeInfo = getBadgeInfo(score);

return (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-button" onClick={onClose}>X</button>
      <BadgeModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <BadgeModalHeader 
        currentBadge={currentBadgeInfo.currentBadge}
        image={currentBadgeInfo.image}
      />
      {renderTabContent()}
    </div>
  </div>
);
}

export default PersonalBadgeModal;