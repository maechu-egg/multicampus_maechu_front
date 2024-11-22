import React, { useEffect, useState } from 'react';
import api from '../../../services/api/axios';
import { useAuth } from '../../../context/AuthContext';
import './BadgeRankSection.css';

type BadgeLevel = '기본' | '브론즈' | '실버' | '골드' | '플래티넘' | '다이아몬드';

// 개인 뱃지 랭킹 인터페이스
interface PersonalRankUser {
  memberId: number;
  nickname: string;  
  currentPoints: number;
  badgeLevel: BadgeLevel;
}

// 크루 뱃지 랭킹 인터페이스 - 백엔드 DTO 구조에 맞게 수정
interface CrewRankUser {
  crew_badge_id: number;
  crew_current_points: number;
  member_id: number;
  badge_level: BadgeLevel;
  crew_battle_wins: number;
  nickname: string;
}

const badgeImages: Record<BadgeLevel, string> = {
  '기본': process.env.PUBLIC_URL + '/img/personalBadge/badgeDefault.png',
  '브론즈': process.env.PUBLIC_URL + '/img/personalBadge/badgeBronze.png',
  '실버': process.env.PUBLIC_URL + '/img/personalBadge/badgeSilver.png',
  '골드': process.env.PUBLIC_URL + '/img/personalBadge/badgeGold.png',
  '플래티넘': process.env.PUBLIC_URL + '/img/personalBadge/badgePlatinum.png',
  '다이아몬드': process.env.PUBLIC_URL + '/img/personalBadge/badgeDiamond.png'
};

const crewBadgeImages: Record<BadgeLevel, string> = {
  '기본': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeDefault.png',
  '브론즈': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeBronze.png',
  '실버': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeSilver.png',
  '골드': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeGold.png',
  '플래티넘': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgePlatinum.png',
  '다이아몬드': process.env.PUBLIC_URL + '/img/crewBadge/CrewBadgeDiamond.png'
};

interface BadgeRankSectionProps {
  isCrew?: boolean;
}

function BadgeRankSection({ isCrew = false }: BadgeRankSectionProps) {
  const [topRanks, setTopRanks] = useState<PersonalRankUser[] | CrewRankUser[]>([]);
  const [currentRank, setCurrentRank] = useState<PersonalRankUser | CrewRankUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useAuth();
  const { token, memberId } = state;

  useEffect(() => {
    const fetchRankings = async () => {
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
  
        if (isCrew) {
          const response = await api.get('/crew_badges/ranking', config);
          console.log('[DEBUG] 크루 뱃지 랭킹 응답:', response.data);
          
          // 백엔드 응답 데이터를 그대로 사용
          const rankings = response.data;
          const current = rankings.find((user: CrewRankUser) => 
            user.member_id === Number(memberId)
          );
        
          setTopRanks(rankings);
          if (current) {
            setCurrentRank(current);
          }
        }
        else {
          const response = await api.get('/badges/user/rankings', config);
          const rankings = response.data;
          const current = rankings.find((user: PersonalRankUser) => 
            user.memberId === Number(memberId)
          );
  
          setTopRanks(rankings);
          if (current) {
            setCurrentRank(current);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('[DEBUG] 랭킹 조회 실패:', error);
        setIsLoading(false);
      }
    };
  
    fetchRankings();
  }, [isCrew, token, memberId]);

  const renderUserInfo = (rank: PersonalRankUser | CrewRankUser) => {
    if (isCrew) {
      const crewRank = rank as CrewRankUser;
      return (
        <div className="user-info-personal">
          <div className="badge-nickname-container">
            <img 
              src={crewBadgeImages[crewRank.badge_level]} 
              alt={crewRank.badge_level} 
              className="rank-badge-image"
            />
            <span className="username-section">
              <span className="nickname">{crewRank.nickname}</span>
              {crewRank.member_id === (currentRank as CrewRankUser)?.member_id && 
                <span className="current-user-tag">나</span>
              }
            </span> 
          </div>
        </div>
      );
    } else {
      const personalRank = rank as PersonalRankUser;
      return (
        <div className="user-info-personal">
          <div className="badge-nickname-container">
            <img 
              src={badgeImages[personalRank.badgeLevel]} 
              alt={personalRank.badgeLevel} 
              className="rank-badge-image"
            />
            <span className="username-section">
              <span className="nickname">{personalRank.nickname}</span>
              {isCrew 
                ? (rank as CrewRankUser).member_id === (currentRank as CrewRankUser)?.member_id 
                : (rank as PersonalRankUser).memberId === (currentRank as PersonalRankUser)?.memberId && 
                <span className="current-user-tag">나</span>
              }
            </span>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return <div className="rank-loading">순위를 불러오는 중...</div>;
  }

  return (
    <div className="rank-section">
      <h3 className="rank-title">
        {isCrew ? '크루 뱃지 TOP 10' : '개인 뱃지 TOP 10'}
      </h3>
      
      <div className="rank-list">
        {topRanks.map((rank, index) => {
          const rankId = isCrew ? (rank as CrewRankUser).member_id : (rank as PersonalRankUser).memberId;
          const currentRankId = isCrew 
            ? (currentRank as CrewRankUser)?.member_id 
            : (currentRank as PersonalRankUser)?.memberId;
          
          return (
            <div 
              key={rankId} 
              className={`rank-item ${
                rankId === currentRankId ? 'current-user' : ''
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
                {renderUserInfo(rank)}
                <span className="score">
                  {isCrew 
                    ? `${(rank as CrewRankUser).crew_current_points}점`
                    : `${(rank as PersonalRankUser).currentPoints}점`
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {currentRank && (
        <div className="current-user-section">
          <div className="divider"></div>
          <div className="rank-item current-user">
            <div className="rank-position">
              <span className="rank-number">
                {topRanks.findIndex(rank => 
                  isCrew 
                    ? (rank as CrewRankUser).member_id === (currentRank as CrewRankUser).member_id
                    : (rank as PersonalRankUser).memberId === (currentRank as PersonalRankUser).memberId
                ) + 1}
              </span>
            </div>
            <div className="user-info">
              {renderUserInfo(currentRank)}
              <span className="score">
                {isCrew 
                  ? `${(currentRank as CrewRankUser).crew_current_points}점`
                  : `${(currentRank as PersonalRankUser).currentPoints}점`
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeRankSection;