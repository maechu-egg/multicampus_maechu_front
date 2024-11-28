import React from 'react';

interface BadgeModalHeaderProps {
  currentBadge: string;
  image: string;
  isCrew?: boolean;  // 크루 뱃지 여부를 확인하는 prop 추가
}

function BadgeModalHeader({ currentBadge, image, isCrew = false }: BadgeModalHeaderProps) {
  // 이미 한글로 전달되는 경우를 위한 수정
  const koreanBadgeName = currentBadge || '기본';

  // 이미지 경로를 props로 전달받은 image를 사용
  const imageUrl = image || (isCrew 
    ? `/img/crewBadge/CrewBadge${currentBadge}.png`
    : `/img/personalBadge/badge${currentBadge}.png`);

  console.log('BadgeModalHeader 렌더링:', {
    currentBadge,
    koreanBadgeName,
    imageUrl,
    isCrew
  });

  return (
    <div className="modal-header">
      <img 
        src={imageUrl} 
        alt={`${koreanBadgeName} 뱃지`} 
        className="modal-badge-image" 
        onError={(e) => {
          console.error('이미지 로딩 실패:', {
            attemptedUrl: imageUrl,
            currentBadge,
            timestamp: new Date().toISOString()
          });
          e.currentTarget.src = '/img/error-image.png';
        }}
      />
      <h2>{koreanBadgeName}</h2> 
    </div>
  );
}

export default BadgeModalHeader;