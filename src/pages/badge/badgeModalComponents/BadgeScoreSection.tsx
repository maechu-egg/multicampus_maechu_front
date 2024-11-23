interface BadgeScoreSectionProps {
  score: number;
  rank: number;
  currentBadge: string; 
}

function BadgeScoreSection({ score, rank, currentBadge }: BadgeScoreSectionProps) {
  // 등급별 배경색 설정
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "다이아몬드":
        return "#B9F2FF";  
      case "플래티넘":
        return "#68D0C0";  
      case "골드":
        return "#FFD700";  
      case "실버":
        return "#C0C0C0";  
      case "브론즈":
        return "#CD7F32";  
      default:
        return "#f0f0f0";  
    }
  };

  return (
    <div 
      className="score-section"
      style={{ backgroundColor: getBadgeColor(currentBadge) }}
    >
      <div className="score-item">
      <span className="score-label">점수</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
      <span className="score-label">상위</span>
        <span className="score-value">{rank}</span>
      </div>
    </div>
  );
}

export default BadgeScoreSection;