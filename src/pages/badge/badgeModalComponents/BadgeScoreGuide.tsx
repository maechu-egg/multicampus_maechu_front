import React, { useState } from 'react';
import './BadgeScoreGuide.css';

interface BadgeGuideItem {
  badge: string;
  image: string;
  requiredScore: number;
  description: string;
}

interface BadgeScoreGuideProps {
  isCrew?: boolean;
}

const getBadgeGuides = (isCrew: boolean): BadgeGuideItem[] => {
  return [
    {
      badge: "다이아몬드",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgeDiamond.png' : '/img/personalBadge/badgeDiamond.png'),
      requiredScore: 100,
      description: "최고 등급의 뱃지입니다."
    },
    {
      badge: "플래티넘",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgePlatinum.png' : '/img/personalBadge/badgePlatinum.png'),
      requiredScore: 70,
      description: "상위 10%의 뱃지입니다."
    },
    {
      badge: "골드",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgeGold.png' : '/img/personalBadge/badgeGold.png'),
      requiredScore: 50,
      description: "상위 30%의 뱃지입니다."
    },
    {
      badge: "실버",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgeSilver.png' : '/img/personalBadge/badgeSilver.png'),
      requiredScore: 30,
      description: "상위 50%의 뱃지입니다."
    },
    {
      badge: "브론즈",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgeBronze.png' : '/img/personalBadge/badgeBronze.png'),
      requiredScore: 10,
      description: "운동과 식단을 시작한 뱃지입니다."
    },
    {
      badge: isCrew ? "기본" : "기본",
      image: process.env.PUBLIC_URL + (isCrew ? '/img/crewBadge/CrewBadgeDefault.png' : '/img/personalBadge/badgeDefault.png'),
      requiredScore: 0,
      description: "첫 시작을 환영합니다!"
    }
  ];
};

function BadgeScoreGuide({ isCrew = false }: BadgeScoreGuideProps) {
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [isPointExpanded, setIsPointExpanded] = useState(false);
  const badgeGuides = getBadgeGuides(isCrew);

  return (
    <div className="badge-guide-container">
      {/* 점수 획득 설명 섹션 */}
      <button 
        className="guide-toggle-button"
        onClick={() => setIsPointExpanded(!isPointExpanded)}
        style={{ marginBottom: '15px' }}
      >
        <h3>점수 획득 방법</h3>
        <span className={`arrow ${isPointExpanded ? 'up' : 'down'}`}>
          {isPointExpanded ? '▼' : '▶'}
        </span>
      </button>
      
      {isPointExpanded && (
        <div className="point-guide-list">
          {isCrew ? (
            // 크루 뱃지 점수 획득 방법
            <div className="point-guide-item">
              <div className="point-type">배틀 승리시</div>
              <div className="point-value">1점</div>
            </div>
          ) : (
            // 개인 뱃지 점수 획득 방법
            <>
              <div className="point-guide-item">
                <div className="point-type">식단 기록</div>
                <div className="point-value">0.5점</div>
              </div>
              <div className="point-guide-item">
                <div className="point-type">운동 기록</div>
                <div className="point-value">0.5점</div>
              </div>
              <div className="point-guide-item">
                <div className="point-type">게시물 작성</div>
                <div className="point-value">0.5점</div>
              </div>
              <div className="point-guide-item">
                <div className="point-type">댓글 작성</div>
                <div className="point-value">0.5점</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 기존의 뱃지 등급 안내 섹션 */}
      <button 
        className="guide-toggle-button"
        onClick={() => setIsGuideExpanded(!isGuideExpanded)}
      >
        <h3>뱃지 등급 안내</h3>
        <span className={`arrow ${isGuideExpanded ? 'up' : 'down'}`}>
          {isGuideExpanded ? '▼' : '▶'}
        </span>
      </button>
      
      {isGuideExpanded && (
        <div className="badge-guide-list">
          {badgeGuides.map((guide) => (
            <div key={guide.badge} className="badge-guide-item">
              <img src={guide.image} alt={guide.badge} className="badge-image" />
              <div className="badge-info">
                <h4>{guide.badge}</h4>
                <p className="required-score">{guide.requiredScore}점 이상</p>
                <p className="description">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgeScoreGuide;