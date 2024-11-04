import React, { useState, useEffect } from "react";
import axios from "axios";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";
import BadgeScoreGuide from './badgeModalComponents/BadgeScoreGuide';
import BadgeRankSection from './badgeModalComponents/BadgeRankSection';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/axios';

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

function PersonalBadgeModal({ isOpen, onClose }: PersonalBadgeModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState('badge-info');
  const [currentBadgeInfo, setCurrentBadgeInfo] = useState<BadgeInfo>({
    currentBadge: '',
    nextBadge: '',
    image: ''
  });
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [scoreLeft, setScoreLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<Stats>({
    dietCount: 0,
    exerciseCount: 0,
    postCount: 0,
    commentCount: 0
  });

  const { state } = useAuth();
  const { token, memberId } = state;

  useEffect(() => {
    const fetchBadgeInfo = async () => {
      try {
        if (!token || !memberId) {
          console.log('Token or memberId is missing');
          return;
        }
  
        // 토큰 형식 로깅
        console.log('Token:', token);
        console.log('Request URL:', `badges/user/${memberId}`);
  
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        };
  
        // 요청 설정 로깅
        console.log('Request config:', config);
  
        const response = await api.get(`badges/user/${memberId}`, config);
  
        console.log('Response:', response.data);
  
        const data = response.data;
        setCurrentBadgeInfo({
          currentBadge: data.currentBadge,
          nextBadge: data.nextBadge,
          image: data.image
        });
        setScore(data.score);
        setRank(data.rank);
        setScoreLeft(data.scoreLeft);
        setProgress(data.progress);
  
      } catch (error) {
        console.error('Failed to fetch badge info:', error);
        if (axios.isAxiosError(error)) {
          console.log('Full error response:', error.response);
          console.log('Error config:', error.config);
          console.log('Error headers:', error.response?.headers);
        }
      }
    };
  
    const fetchActivityRecords = async () => {
      try {
        if (!token || !memberId) return;
  
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        };
  
        const response = await api.get(`badges/user/${memberId}/activities`, config);
  
        const data = response.data;
        setStats({
          dietCount: data.dietCount,
          exerciseCount: data.exerciseCount,
          postCount: data.postCount,
          commentCount: data.commentCount
        });
  
      } catch (error) {
        console.error('Failed to fetch activity records:', error);
      }
    };
  
    if (isOpen) {
      fetchBadgeInfo();
      fetchActivityRecords();
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
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

export default PersonalBadgeModal;