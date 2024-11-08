interface BadgeFooterSectionProps {
  scoreLeft: number;
  progress: number;
  nextBadge: string | null;
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
      <p>다음 등급까지 {scoreLeft}점 남았습니다</p>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
      </div>
    </div>
  );
}

export default BadgeFooterSection;