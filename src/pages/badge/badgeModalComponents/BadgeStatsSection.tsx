import React from 'react';

interface BadgeStatsSectionProps {
  stats: {
    dietCount: number;
    exerciseCount: number;
    postCount: number;
    commentCount: number;
  }
}

function BadgeStatsSection({ stats }: BadgeStatsSectionProps) {
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