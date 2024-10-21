import React from "react";
import badgeImage from 'assets/badgeGold.png';


interface BadgeModalHeaderProps {
  title: string;
}

function BadgeModalHeader({ title }: BadgeModalHeaderProps) {
  return (
    <div className="modal-header">
      <img src={badgeImage} alt="badge" className="modal-badge-image" />
      <h2>{title}</h2>
    </div>
  );
}

export default BadgeModalHeader;
