import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api/axios";
import axios from "axios";
import "./badgeModalComponents/BadgeModal.css";
import BadgeModalHeader from "./badgeModalComponents/BadgeModalHeader";
import BadgeScoreSection from "./badgeModalComponents/BadgeScoreSection";
import BadgeStatsSection from "./badgeModalComponents/BadgeStatsSection";
import BadgeFooterSection from "./badgeModalComponents/BadgeFooterSection";
import BadgeModalTabs from "./badgeModalComponents/BadgeModalTabs";
import BadgeScoreGuide from "./badgeModalComponents/BadgeScoreGuide";
import BadgeRankSection from "./badgeModalComponents/BadgeRankSection";
import { createPortal } from "react-dom";

interface CrewBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BadgeLevel =
  | "기본"
  | "브론즈"
  | "실버"
  | "골드"
  | "플래티넘"
  | "다이아몬드";

interface CrewBadgeResponse {
  status: string;
  badgeInfo: {
    crew_badge_id: number;
    crew_current_points: number;
    member_id: number;
    badge_level: BadgeLevel;
    crew_battle_wins: number;
  };
}

interface CreateBadgeResponse {
  status: string;
  message: string;
}

interface BattleWinsResponse {
  message: string;
  status: string;
  totalBattleWins: number;
}

interface BadgeInfo {
  currentBadge: BadgeLevel;
  nextBadge: string;
  image: string;
}

interface Stats {
  battleWins: number;
}

const crewBadgeImages: Record<BadgeLevel, string> = {
  기본: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgeDefault.png",
  브론즈: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgeBronze.png",
  실버: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgeSilver.png",
  골드: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgeGold.png",
  플래티넘: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgePlatinum.png",
  다이아몬드: process.env.PUBLIC_URL + "/img/crewBadge/CrewBadgeDiamond.png",
};

function CrewBadgeModal({
  isOpen,
  onClose,
}: CrewBadgeModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState("badge-info");
  const [currentBadgeInfo, setCurrentBadgeInfo] = useState<BadgeInfo>({
    currentBadge: "기본",
    nextBadge: "브론즈",
    image: crewBadgeImages["기본"],
  });
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [scoreLeft, setScoreLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [battleWins, setBattleWins] = useState(0);
  const [stats, setStats] = useState<Stats>({
    battleWins: 0,
  });

  const { state } = useAuth();
  const { token, memberId } = state;

  const getCrewBadgeInfo = (score: number) => {
    if (score >= 100) {
      return {
        currentBadge: "다이아몬드" as BadgeLevel,
        image: crewBadgeImages["다이아몬드"],
        nextBadge: null,
        requiredScore: null,
      };
    } else if (score >= 70) {
      return {
        currentBadge: "플래티넘" as BadgeLevel,
        image: crewBadgeImages["플래티넘"],
        nextBadge: "다이아몬드",
        requiredScore: 100,
      };
    } else if (score >= 50) {
      return {
        currentBadge: "골드" as BadgeLevel,
        image: crewBadgeImages["골드"],
        nextBadge: "플래티넘",
        requiredScore: 70,
      };
    } else if (score >= 30) {
      return {
        currentBadge: "실버" as BadgeLevel,
        image: crewBadgeImages["실버"],
        nextBadge: "골드",
        requiredScore: 50,
      };
    } else if (score >= 10) {
      return {
        currentBadge: "브론즈" as BadgeLevel,
        image: crewBadgeImages["브론즈"],
        nextBadge: "실버",
        requiredScore: 30,
      };
    } else {
      return {
        currentBadge: "기본" as BadgeLevel,
        image: crewBadgeImages["기본"],
        nextBadge: "브론즈",
        requiredScore: 10,
      };
    }
  };

  const calculateProgress = (score: number): number => {
    if (score >= 100) return 100;
    if (score >= 70) return ((score - 70) / 30) * 100;
    if (score >= 50) return ((score - 50) / 20) * 100;
    if (score >= 30) return ((score - 30) / 20) * 100;
    if (score >= 10) return ((score - 10) / 20) * 100;
    return (score / 10) * 100;
  };

  const getBadgeThreshold = (score: number): number => {
    if (score >= 100) return 100;
    if (score >= 70) return 70;
    if (score >= 50) return 50;
    if (score >= 30) return 30;
    if (score >= 10) return 10;
    return 0;
  };

  const fetchBadgeInfo = async () => {
    try {
      if (!token || !memberId) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await api.get<CrewBadgeResponse>(
          `/crew_badges/${memberId}`,
          config
        );
        console.log("[DEBUG] 서버 응답:", response.data);

        if (response.data && response.data.status === "success") {
          const badgeData = response.data.badgeInfo;
          const currentScore = badgeData.crew_current_points;
          const badgeInfo = getCrewBadgeInfo(currentScore);

          console.log("[DEBUG] 뱃지 정보:", {
            현재점수: currentScore,
            현재등급: badgeData.badge_level,
            다음등급: badgeInfo.nextBadge,
            필요점수: badgeInfo.requiredScore,
          });
          

          setCurrentBadgeInfo({
            currentBadge: badgeInfo.currentBadge, // badgeInfo에서 currentBadge 가져오기
            nextBadge: badgeInfo.nextBadge || "", // badgeInfo에서 nextBadge 가져오기
            image: badgeInfo.image, // badgeInfo에서 image 가져오기
          });

          setScore(currentScore);

          // 다음 등급까지 필요한 점수 계산
          if (badgeInfo.nextBadge && badgeInfo.requiredScore !== null) {
            const remainingScore = badgeInfo.requiredScore - currentScore;
            console.log("[DEBUG] 점수 계산:", {
              현재점수: currentScore,
              다음등급필요점수: badgeInfo.requiredScore,
              남은점수: remainingScore,
            });

            setScoreLeft(remainingScore);
            setProgress(calculateProgress(currentScore));
          } else {
            setScoreLeft(0);
            setProgress(100);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log("[DEBUG] 뱃지 없음, 생성 시도");

          try {
            const createResponse = await api.post<CreateBadgeResponse>(
              "/crew_badges/create",
              { member_id: memberId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("[DEBUG] 생성 응답:", createResponse.data);

            if (createResponse.status === 201) {
              console.log("[DEBUG] 생성 성공, 기본값 설정");

              await new Promise((resolve) => setTimeout(resolve, 1000));

              try {
                console.log("[DEBUG] 생성 후 재조회 시도");
                const newResponse = await api.get<CrewBadgeResponse>(
                  `/crew_badges/${memberId}`,
                  config
                );
                console.log("[DEBUG] 재조회 응답:", newResponse.data);

                if (newResponse.data && newResponse.data.status === "성공") {
                  const data = newResponse.data.badgeInfo;
                  setCurrentBadgeInfo({
                    currentBadge: data.badge_level,
                    nextBadge: "브론즈",
                    image: crewBadgeImages[data.badge_level],
                  });
                  setScore(data.crew_current_points);
                  setScoreLeft(10);
                  setProgress(0);
                } else {
                  console.log("[DEBUG] 재조회 실패, 기본값 설정");
                  const defaultBadge: BadgeLevel = "기본";
                  setCurrentBadgeInfo({
                    currentBadge: defaultBadge,
                    nextBadge: "브론즈",
                    image: crewBadgeImages[defaultBadge],
                  });
                  setScore(0);
                  setScoreLeft(10);
                  setProgress(0);
                }
              } catch (getError) {
                console.error("[DEBUG] 재조회 실패:", getError);
                const defaultBadge: BadgeLevel = "기본";
                setCurrentBadgeInfo({
                  currentBadge: defaultBadge,
                  nextBadge: "브론즈",
                  image: crewBadgeImages[defaultBadge],
                });
                setScore(0);
                setScoreLeft(10);
                setProgress(0);
              }
            }
          } catch (createError) {
            console.error("[DEBUG] 생성 요청 실패:", createError);
          }
        }
      }
    } catch (error) {
      console.error("[DEBUG] 전체 처리 실패:", error);
    }
  };

  const fetchBattleWins = async () => {
    try {
      if (!token || !memberId) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post<BattleWinsResponse>(
        `/crew_badges/${memberId}/updatePoints`,
        null,
        config
      );

      if (response.data.status === "success") {
        console.log("배틀 승리 정보:", response.data);
        setBattleWins(response.data.totalBattleWins);
      }
    } catch (error) {
      console.error("배틀 승리 정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBadgeInfo();
      fetchBattleWins();
    }
  }, [isOpen, token, memberId]);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "badge-info":
        return (
          <>
            <BadgeScoreSection
              score={score}
              rank={rank}
              currentBadge={currentBadgeInfo.currentBadge}
            />
            <div className="stats-footer-container">
              <BadgeStatsSection
                stats={stats}
                isCrew={true} // isCrew prop 추가
              />
              <BadgeFooterSection
                scoreLeft={scoreLeft}
                progress={progress}
                nextBadge={currentBadgeInfo.nextBadge}
              />
            </div>
          </>
        );
      case "score-guide":
        return <BadgeScoreGuide isCrew={true} />;
      case "rank":
        return <BadgeRankSection isCrew={true} />;
      default:
        return null;
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <BadgeModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "badge-info" && (
          <BadgeModalHeader
            currentBadge={currentBadgeInfo.currentBadge}
            image={currentBadgeInfo.image}
            isCrew={true}
          />
        )}
        {renderTabContent()}
      </div>
    </div>,
    document.body
  );
}

export default CrewBadgeModal;
