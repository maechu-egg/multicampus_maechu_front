import React, { useEffect, useState } from "react";
import axios from "axios";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";
import BadgeScoreGuide from './badgeModalComponents/BadgeScoreGuide';
import BadgeRankSection from './badgeModalComponents/BadgeRankSection';  

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

interface ActivityRecord {
  recordId: number;
  activityType: string;
  points: number;
  createdDate: string;
  memberId: number;
}

interface BadgeResponse {
  member_id: number;
  current_points: number;
  badge_level: string;
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
      currentBadge: "뉴비",
      image: badgeImages.default,
      nextBadge: "브론즈",
      requiredScore: 10
    };
  }
};

function PersonalBadgeModal({ isOpen, onClose }: PersonalBadgeModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState('badge-info');
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState('0%');
  const [stats, setStats] = useState<UserStats>({
    workoutDays: 0,
    dietDays: 0,
    posts: 0,
    comments: 0
  });
  const [scoreLeft, setScoreLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      const memberId = localStorage.getItem('memberId');

      // 1. 먼저 뱃지 정보 가져오기
      axios.get<BadgeResponse>(`http://localhost:8001/badges/user/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const { current_points, badge_level } = response.data;
        console.log('뱃지 정보 응답:', response.data);  // 추가
        console.log('현재 점수:', current_points);      // 추가
        console.log('현재 등급:', badge_level);         // 추가

        setScore(current_points);

        // 뱃지 정보에 따른 UI 업데이트
        const badgeInfo = getBadgeInfo(current_points);
        if (badgeInfo.requiredScore) {
          const remainingScore = badgeInfo.requiredScore - current_points;
          setScoreLeft(remainingScore);
          
          const currentThreshold = getBadgeThreshold(current_points);
          const progressPercentage = ((current_points - currentThreshold) / 
            (badgeInfo.requiredScore - currentThreshold)) * 100;
          setProgress(Math.min(Math.max(progressPercentage, 0), 100));

          console.log('다음 등급까지 남은 점수:', remainingScore);  // 추가
          console.log('진행률:', progressPercentage);           
        } else {
          setScoreLeft(0);
          setProgress(100);
        }
      })
      .catch(error => {
        console.error("Failed to fetch badge info:", error);
      });

      // 2. 활동 기록 가져와서 통계 계산
      axios.get(`http://localhost:8001/badges/user/${memberId}/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const activities = response.data;
        setActivities(activities);

        // 활동 기록으로부터 통계만 계산
        const stats = calculateStats(activities);
        setStats(stats);
      })
      .catch(error => {
        console.error("Failed to fetch activity records:", error);
      });
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

  // 활동 기록으로부터 통계 계산하는 함수
  const calculateStats = (activities: ActivityRecord[]) => {
    const workoutDays = new Set(
      activities
        .filter(a => a.activityType === 'exercise')
        .map(a => a.createdDate.split('T')[0])
    ).size;

    const dietDays = new Set(
      activities
        .filter(a => a.activityType === 'diet')
        .map(a => a.createdDate.split('T')[0])
    ).size;

    return {
      workoutDays,
      dietDays,
      posts: 0,  // 이 값들은 다른 API에서 가져와야 할 수 있음
      comments: 0
    };
  };

  if (!isOpen) return null;

  // 현재 점수에 따른 뱃지 정보 가져오기
  const currentBadgeInfo = getBadgeInfo(score);

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
        return <BadgeScoreGuide />;

      case 'rank':
          return <BadgeRankSection />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <BadgeModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {/* 뱃지정보에서만 BadgeModalHeader 표시 */}
        {activeTab !== 'score-guide' && activeTab !== 'rank' && (
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

export default PersonalBadgeModal;