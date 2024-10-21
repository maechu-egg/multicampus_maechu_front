import React from "react";
import personImage from "assets/badgeGold.png";

interface BadgeStatsSectionProps {
  stats: {
    workoutDays: number;
    dietDays: number;
    posts: number;
    comments: number;
  };
}

function BadgeStatsSection({ stats }: BadgeStatsSectionProps) {
  return (
    <div className="stats-section">
      <img src={personImage} alt="Person" className="modal-person-image" />
      <div className="stats">
        <p>운동한 일수: {stats.workoutDays}일</p>
        <p>기록한 식단: {stats.dietDays}개</p>
        <p>작성한 게시물: {stats.posts}개</p>
        <p>내가 단 댓글: {stats.comments}개</p>
      </div>
    </div>
  );
}

export default BadgeStatsSection;
