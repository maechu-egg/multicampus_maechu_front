import React, { useEffect, useState } from "react";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";
import BadgeScoreGuide from './badgeModalComponents/BadgeScoreGuide';
import BadgeRankSection from './badgeModalComponents/BadgeRankSection';  
import { useAuth } from "../../context/AuthContext";  
import api from "../../services/api/axios"; 

interface PersonalBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BadgeInfo {
  currentBadge: string;
  nextBadge: string;
  image: string;
}

interface Stats {
  dietCount: number;
  exerciseCount: number;
  postCount: number;
  commentCount: number;
}

interface ActivityRecord {
  recordId: number;
  activityType: string;
  points: number;
  createdDate: string;
  memberId: number;
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
  const [currentBadgeInfo, setCurrentBadgeInfo] = useState<BadgeInfo>({
    currentBadge: '기본',
    nextBadge: '',
    image: badgeImages.default
  });
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [stats, setStats] = useState<Stats>({
    dietCount: 0,
    exerciseCount: 0,
    postCount: 0,
    commentCount: 0
  });
  const [scoreLeft, setScoreLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  const { state } = useAuth();
  const { token, memberId } = state;

  const getBadgeThreshold = (score: number): number => {
    if (score >= 100) return 100;
    if (score >= 70) return 70;
    if (score >= 50) return 50;
    if (score >= 30) return 30;
    if (score >= 10) return 10;
    return 0;
  };

  const calculateStats = (activities: ActivityRecord[]): Stats => {
    const exerciseCount = new Set(
      activities
        .filter(a => a.activityType === 'exercise')
        .map(a => a.createdDate.split('T')[0])
    ).size;
    
    const dietCount = new Set(
      activities
        .filter(a => a.activityType === 'diet')
        .map(a => a.createdDate.split('T')[0])
    ).size;

    return {
      dietCount,
      exerciseCount,
      postCount: 0,
      commentCount: 0
    };
  };

  useEffect(() => {
    const fetchBadgeInfo = async () => {
      try {
        if (!token || !memberId) {
          console.log('[DEBUG] 인증 정보 없음:', { token: !!token, memberId });
          return;
        }
    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
    
        const response = await api.get(`badges/user/${memberId}/badge`, config);
        const data = response.data;
        
        console.log('[DEBUG] 뱃지 정보:', data);
        
        setScore(data.current_points || 0);
        const badgeInfo = getBadgeInfo(data.current_points || 0);
        
        setCurrentBadgeInfo({
          currentBadge: data.badge_level,
          nextBadge: badgeInfo.nextBadge || '',
          image: badgeImages[data.badge_level.toLowerCase() as keyof typeof badgeImages] || badgeImages.default
        });

        if (badgeInfo.requiredScore) {
          const remainingScore = badgeInfo.requiredScore - data.current_points;
          setScoreLeft(remainingScore);
          
          const currentThreshold = getBadgeThreshold(data.current_points);
          const progressPercentage = ((data.current_points - currentThreshold) / 
            (badgeInfo.requiredScore - currentThreshold)) * 100;
          setProgress(Math.min(Math.max(progressPercentage, 0), 100));
        } else {
          setScoreLeft(0);
          setProgress(100);
        }
      } catch (error) {
        console.error('[DEBUG] 뱃지 정보 조회 실패:', error);
      }
    };

    const fetchActivities = async () => {
      try {
        if (!token || !memberId) return;

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await api.get(`badges/user/${memberId}/activities`, config);
        const activities = response.data;
        setActivities(activities);
        const calculatedStats = calculateStats(activities);
        setStats(calculatedStats);
      } catch (error) {
        console.error('[DEBUG] 활동 기록 조회 실패:', error);
      }
    };

    if (isOpen) {
      fetchBadgeInfo();
      fetchActivities();
    }
  }, [isOpen, token, memberId]);

  if (!isOpen) return null;

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
        <button className="modal-close-button" onClick={onClose}>×</button>
        <BadgeModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'badge-info' && (
          <BadgeModalHeader 
            currentBadge={currentBadgeInfo.currentBadge}
            image={currentBadgeInfo.image}
            isCrew={false}
          />
        )}
        {renderTabContent()}
      </div>
    </div>
  );
}

export default PersonalBadgeModal;