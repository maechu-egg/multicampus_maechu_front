import React from 'react';

interface BadgeModalHeaderProps {
  currentBadge: string;
  image: string;
  isCrew?: boolean;  // 크루 뱃지 여부를 확인하는 prop 추가
}

function BadgeModalHeader({ currentBadge, image, isCrew = false }: BadgeModalHeaderProps) {
  const badgeNameKorean: { [key: string]: string } = {
    'Default': '기본',
    'Bronze': '브론즈',
    'Silver': '실버',
    'Gold': '골드',
    'Platinum': '플래티넘',
    'Diamond': '다이아몬드'
  };

  // 이미지 경로를 props로 전달받은 image를 사용하도록 수정
  const imageUrl = image || (isCrew 
    ? process.env.PUBLIC_URL + `/img/crewBadge/CrewBadge${currentBadge}.png`
    : process.env.PUBLIC_URL + `/img/personalBadge/badge${currentBadge}.png`);
    
  const koreanBadgeName = badgeNameKorean[currentBadge] || '기본';

  console.log('BadgeModalHeader 렌더링:', {
    currentBadge,
    imageUrl,
    isCrew,
    publicUrl: process.env.PUBLIC_URL,
    fullPath: imageUrl
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
          e.currentTarget.src = process.env.PUBLIC_URL + '/img/error-image.png';
        }}
      />
      <h2>{koreanBadgeName}</h2> 
    </div>
  );
}

export default BadgeModalHeader;