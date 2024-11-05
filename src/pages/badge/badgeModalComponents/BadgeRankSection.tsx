import React, { useEffect, useState } from 'react';
import api from '../../../services/api/axios';
import { useAuth } from '../../../context/AuthContext';
import './BadgeRankSection.css';

interface RankUser {
  memberId: number;
  currentPoints: number;
  badgeLevel: string;
}

interface CrewRank {
  memberId: number;  
  memberName: string;  
  currentPoints: number;
}

interface BadgeRankSectionProps {
  isCrew?: boolean;
}

function BadgeRankSection({ isCrew = false }: BadgeRankSectionProps) {
  const [topRanks, setTopRanks] = useState<RankUser[] | CrewRank[]>([]);
  const [currentRank, setCurrentRank] = useState<RankUser | CrewRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useAuth();
  const { token, memberId } = state;

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        if (!token || !memberId) {
          console.log('Token or memberId is missing');
          return;
        }

        const endpoint = isCrew 
          ? 'badges/crew/rankings'
          : 'badges/user/rankings';

        const response = await api.get(
          endpoint,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Rankings response:', response.data);

        const rankings = response.data;
        const current = rankings.find((user: RankUser | CrewRank) => 
          user.memberId === Number(memberId)
        );

        setTopRanks(rankings);
        if (current) {
          setCurrentRank(current);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, [isCrew, token, memberId]);

  if (isLoading) {
    return <div className="rank-loading">순위를 불러오는 중...</div>;
  }

  return (
    <div className="rank-section">
      <h3 className="rank-title">TOP 10 랭킹</h3>
      
      <div className="rank-list">
        {topRanks.map((rank, index) => (
          <div 
            key={rank.memberId} 
            className={`rank-item ${
              rank.memberId === currentRank?.memberId ? 'current-user' : ''
            } ${index < 3 ? 'top-three' : ''}`}
          >
            <div className="rank-position">
              {index < 3 ? (
                <div className={`trophy rank-${index + 1}`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              ) : (
                <span className="rank-number">{index + 1}</span>
              )}
            </div>
            
            <div className="user-info">
              <span className="username">
                {isCrew 
                  ? (rank as CrewRank).memberName
                  : `User ${rank.memberId}`}
                {rank.memberId === currentRank?.memberId && 
                  <span className="current-user-tag">나</span>
                }
              </span>
              <span className="score">{rank.currentPoints}점</span>
            </div>
          </div>
        ))}
      </div>

      {currentRank && (
        <div className="current-user-section">
          <div className="divider"></div>
          <div className="rank-item current-user">
            <div className="rank-position">
              <span className="rank-number">
                {topRanks.findIndex(rank => rank.memberId === currentRank.memberId) + 1}
              </span>
            </div>
            <div className="user-info">
              <span className="username">
                {isCrew 
                  ? (currentRank as CrewRank).memberName
                  : `User ${currentRank.memberId}`}
                <span className="current-user-tag">나</span>
              </span>
              <span className="score">{currentRank.currentPoints}점</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeRankSection;