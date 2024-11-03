import React from 'react';

interface BadgeStatsSectionProps {
  stats: {
    workoutDays: number;
    dietDays: number;
    posts: number;
    comments: number;
  }
}

function BadgeStatsSection({ stats }: BadgeStatsSectionProps) {
  return (
    <div className="stats-section">
      <div className="stats">
        <div>운동 기록: {stats.workoutDays}일</div>
        <div>식단 기록: {stats.dietDays}일</div>
        <div>게시물: {stats.posts}개</div>
        <div>댓글: {stats.comments}개</div>
      </div>
    </div>
  );
}

export default BadgeStatsSection;