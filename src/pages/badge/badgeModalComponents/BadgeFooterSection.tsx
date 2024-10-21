import React from "react";

interface BadgeFooterSectionProps {
  scoreLeft: number;
  progress: number;
}

function BadgeFooterSection({ scoreLeft, progress }: BadgeFooterSectionProps) {
  return (
    <div className="footer">
      <p>다음 등급까지 {scoreLeft}일 남았습니다.</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default BadgeFooterSection;
