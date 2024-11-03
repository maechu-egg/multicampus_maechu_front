import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BadgeRankSection.css';

interface RankUser {
  memberId: number;
  currentPoints: number;
  badgeLevel: string;
}

function BadgeRankSection() {
  const [topRanks, setTopRanks] = useState<RankUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<RankUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentMemberId = localStorage.getItem('memberId');

        const response = await axios.post(
          'http://localhost:8001/badges/user/rankings',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const rankings = response.data;
        const currentUser = rankings.find(
          (user: RankUser) => user.memberId === Number(currentMemberId)
        );

        setTopRanks(rankings);
        if (currentUser) {
          setCurrentUserRank(currentUser);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (isLoading) {
    return <div className="rank-loading">순위를 불러오는 중...</div>;
  }

  return (
    <div className="rank-section">
      <h3 className="rank-title">TOP 10 랭킹</h3>
      
      <div className="rank-list">
        {topRanks.map((user, index) => (
          <div 
            key={user.memberId} 
            className={`rank-item ${user.memberId === currentUserRank?.memberId ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
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
                {`User ${user.memberId}`}
                {user.memberId === currentUserRank?.memberId && <span className="current-user-tag">나</span>}
              </span>
              <span className="score">{user.currentPoints}점</span>
            </div>
          </div>
        ))}
      </div>

      {currentUserRank && (
        <div className="current-user-section">
          <div className="divider"></div>
          <div className="rank-item current-user">
            <div className="rank-position">
              <span className="rank-number">
                {topRanks.findIndex(user => user.memberId === currentUserRank.memberId) + 1}
              </span>
            </div>
            <div className="user-info">
              <span className="username">
                {`User ${currentUserRank.memberId}`}
                <span className="current-user-tag">나</span>
              </span>
              <span className="score">{currentUserRank.currentPoints}점</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeRankSection;