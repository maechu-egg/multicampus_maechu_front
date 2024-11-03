import React, { useState } from "react";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";

// 크루 뱃지 이미지 경로 설정
const crewBadgeImages = {
  default: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgeDefault.png',
  bronze: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgeBronze.png',
  silver: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgeSilver.png',
  gold: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgeGold.png',
  platinum: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgePlatinum.png',
  diamond: process.env.PUBLIC_URL + '/img/crewBadge/crewBadgeDiamond.png'
};

interface CrewBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CrewBadgeModal({ isOpen, onClose }: CrewBadgeModalProps): JSX.Element | null {
  const [badge, setBadge] = useState("실버");
  const [score, setScore] = useState(40);
  const [rank, setRank] = useState("30.5%");
  const [stats, setStats] = useState({ workoutDays: 20, dietDays: 30, posts: 10, comments: 15 });
  const [scoreLeft, setScoreLeft] = useState(20);
  const [progress, setProgress] = useState(30);

  if (!isOpen) return null;

  // 현재 뱃지에 따른 이미지 선택
  const getBadgeImage = (badgeTitle: string) => {
    switch (badgeTitle.toLowerCase()) {
      case "다이아몬드":
        return crewBadgeImages.diamond;
      case "플래티넘":
        return crewBadgeImages.platinum;
      case "골드":
        return crewBadgeImages.gold;
      case "실버":
        return crewBadgeImages.silver;
      case "브론즈":
        return crewBadgeImages.bronze;
      default:
        return crewBadgeImages.default;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <BadgeModalHeader 
          currentBadge={badge}
          image={getBadgeImage(badge)}
        />
        <BadgeScoreSection score={score} rank={rank} />
        <div className="stats-footer-container">
          <BadgeStatsSection stats={stats} />
          <BadgeFooterSection 
            scoreLeft={scoreLeft} 
            progress={progress}
            nextBadge={null}  // 임시로 null 전달
          />
        </div>
      </div>
    </div>
  );
}

export default CrewBadgeModal;