import React from 'react';

interface BadgeStatsSectionProps {
  stats: {
    dietCount?: number;
    exerciseCount?: number;
    postCount?: number;
    commentCount?: number;
    battleWins?: number;
  };
  isCrew?: boolean;
}

function BadgeStatsSection({ stats, isCrew }: BadgeStatsSectionProps) {
  if (isCrew) {
    return (
      <div className="stats-section">
        <div className="stats">
          <div>배틀 승리: {stats.battleWins || 0}회</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <div className="stats">
        <div>운동 기록: {stats.exerciseCount}일</div>
        <div>식단 기록: {stats.dietCount}일</div>
        <div>게시물: {stats.postCount}개</div>
        <div>댓글: {stats.commentCount}개</div>
      </div>
    </div>
  );
}

export default BadgeStatsSection;