import React from "react";

interface BadgeScoreSectionProps {
  score: number;
  rank: string;
}

function BadgeScoreSection({ score, rank }: BadgeScoreSectionProps) {
  return (
    <div className="score-section">
      <div className="score-item">
        <h3>점수</h3>
        <span>{score}</span>
      </div>
      <div className="score-item">
        <h4>순위</h4>
        <span>{rank}</span>
      </div>
    </div>
  );
}

export default BadgeScoreSection;
