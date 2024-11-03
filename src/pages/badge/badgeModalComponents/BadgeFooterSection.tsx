import React from "react";

interface BadgeFooterSectionProps {
  scoreLeft: number;
  progress: number;
  nextBadge: string | null;  // optional(?)을 제거하고 필수 prop으로 변경
}

function BadgeFooterSection({ scoreLeft, progress, nextBadge }: BadgeFooterSectionProps) {
  if (!nextBadge) {
    return (
      <div className="footer">
        <p>최고 등급에 도달했습니다!</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="footer">
      <p>{nextBadge} 등급까지 {scoreLeft}점 남았습니다.</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default BadgeFooterSection;