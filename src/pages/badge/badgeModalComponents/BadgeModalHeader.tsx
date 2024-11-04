import React from 'react';

interface BadgeModalHeaderProps {
  currentBadge: string;  
  image: string;
}

function BadgeModalHeader({ currentBadge, image }: BadgeModalHeaderProps) {
  return (
    <div className="modal-header">
      <img src={image} alt={`${currentBadge} `} className="modal-badge-image" />
      <h2>{currentBadge}</h2>
    </div>
  );
}

export default BadgeModalHeader;