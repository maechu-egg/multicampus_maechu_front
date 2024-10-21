import React, { useEffect, useState } from "react";
import axios from "axios";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";

interface PersonalBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PersonalBadgeModal({ isOpen, onClose }: PersonalBadgeModalProps): JSX.Element | null {
  const [badge, setBadge] = useState("실버");
  const [score, setScore] = useState(40);
  const [rank, setRank] = useState("30.5%");
  const [stats, setStats] = useState({ workoutDays: 20, dietDays: 30, posts: 10, comments: 15 });
  const [scoreLeft, setScoreLeft] = useState(20);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    if (isOpen) {
      axios.get("/api/personal-badge")
        .then(response => {
          const { badge, score, rank, stats, scoreLeft, progress } = response.data;
          setBadge(badge);
          setScore(score);
          setRank(rank);
          setStats(stats);
          setScoreLeft(scoreLeft);
          setProgress(progress);
        })
        .catch(error => console.error("Failed to fetch data", error));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <BadgeModalHeader title={badge} />
        <BadgeScoreSection score={score} rank={rank} />
        <div className="stats-footer-container">
          <BadgeStatsSection stats={stats} />
          <BadgeFooterSection scoreLeft={scoreLeft} progress={progress} />
          
        </div>
      </div>
    </div>
  );
}

export default PersonalBadgeModal;
