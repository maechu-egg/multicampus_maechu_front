import React, { useState } from "react";
import styled from "styled-components";
import CrewBattleFeedDetailModal from "components/ui/crew/modal/CrewBattleFeedDetailModal";

// 배틀 데이터 구조를 위한 인터페이스 정의
interface BattleItem {
  battle_id: number;
  battle_name: string;
  battle_goal: string;
  battle_end_recruitment: string;
  battle_end_date: string;
  battle_content: string;
  battle_state: number; // 0 for 모집중, 1 for 진행중
  crew_id: number;
}

// BattleList 컴포넌트에 전달할 props 타입 정의
interface BattleListProps {
  battleData: BattleItem[];
}

function BattleList({ battleData = [] }: BattleListProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBattleId, setSelectedBattleId] = useState<number | null>(null);
  const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);

  const handleCardClick = (battleId: number, crewId: number) => {
    setSelectedBattleId(battleId);
    setSelectedCrewId(crewId);
    setIsModalOpen(true); // 모달 열기
  };

  return (
    <BattleContainer>
      {battleData.length > 0 ? (
        battleData.map((battle) => (
          <BattleCard
            key={battle.battle_id}
            onClick={() => handleCardClick(battle.battle_id, battle.crew_id)}
          >
            <BattleCardHeader>
              <BattleName>{battle.battle_name}</BattleName>
              <Status state={battle.battle_state}>
                {battle.battle_state === 0 ? "모집중" : "진행중"}
              </Status>
            </BattleCardHeader>
            <BattleInfo>
              <strong>목표:</strong> {battle.battle_goal}
            </BattleInfo>
            <BattleInfo>
              <strong>모집 종료일:</strong>{" "}
              {new Date(battle.battle_end_recruitment).toLocaleDateString()}
            </BattleInfo>
            <BattleInfo>
              <strong>배틀 종료일:</strong>{" "}
              {new Date(battle.battle_end_date).toLocaleDateString()}
            </BattleInfo>
            <BattleInfo>
              <strong>내용:</strong> {battle.battle_content}
            </BattleInfo>
          </BattleCard>
        ))
      ) : (
        <NoData>참여 중인 배틀이 없습니다.</NoData>
      )}

      {/* 모달 컴포넌트 */}
      {isModalOpen && selectedBattleId !== null && selectedCrewId !== null && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CrewBattleFeedDetailModal
              battleId={selectedBattleId}
              crewId={selectedCrewId}
            />
            <CloseButton onClick={() => setIsModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 피드 추가 모달 */}
      <div
        className="modal fade"
        id="battleFeedModal"
        tabIndex={-1}
        aria-labelledby="battleFeedModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="battleFeedModalLabel">
                피드 추가
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* 피드 추가 내용을 여기에 추가 */}
              <p>피드를 추가할 내용을 여기에 작성하세요.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                닫기
              </button>
              <button type="button" className="btn btn-primary">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </BattleContainer>
  );
}

// 스타일 컴포넌트
const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const BattleCard = styled.div`
  width: 100%;
  max-width: 80%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const BattleCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BattleName = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #333;
`;

const Status = styled.span<{ state: number }>`
  font-size: 0.9em;
  font-weight: bold;
  color: ${(props) =>
    props.state === 0
      ? "#ff0000"
      : "#ffcc00"}; /* 모집중: 빨간색, 진행중: 노란색 */
  align-self: flex-end;
`;

const BattleInfo = styled.p`
  margin: 8px 0 0;
  font-size: 0.9em;
  color: #666;
`;

const NoData = styled.p`
  font-size: 1em;
  color: #999;
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소 위에 표시 */
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 800px; /* 최대 너비 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative; /* 닫기 버튼을 위한 상대 위치 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export default BattleList;
