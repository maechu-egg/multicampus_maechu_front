import React from "react";
import styled from "styled-components";

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
  return (
    <BattleContainer>
      {battleData.length > 0 ? (
        battleData.map((battle) => (
          <BattleCard key={battle.battle_id}>
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
  padding: 20px;
`;

const BattleCard = styled.div`
  width: 100%;

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

export default BattleList;
