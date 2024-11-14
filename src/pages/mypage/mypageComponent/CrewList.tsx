import React from "react";
import styled from "styled-components";

interface CrewItem {
  crew_id: number;
  crew_name: string;
  crew_goal: string | null;
  crew_title: string | null;
  crew_location: string | null;
  crew_sport: string | null;
  crew_gender: string | null;
  crew_frequency: string | null;
  crew_age: string | null;
  crew_date: string | null;
  crew_intro_post: string | null;
  crew_intro_img: string | null;
  crew_state: number;
  member_id: number;
}

interface CrewListProps {
  crewData?: CrewItem[]; // Optional property
}

function CrewList({ crewData = [] }: CrewListProps): JSX.Element {
  // crewData will default to an empty array if undefined
  return (
    <CrewContainer>
      {crewData.length > 0 ? (
        crewData.map((crew) => (
          <CrewCard key={crew.crew_id}>
            <CrewName>{crew.crew_name || "이름 없음"}</CrewName>
            <CrewInfo>
              <strong>목표:</strong> {crew.crew_goal || "목표 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>위치:</strong> {crew.crew_location || "위치 정보 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>운동 종류:</strong> {crew.crew_sport || "운동 종류 없음"}
            </CrewInfo>
          </CrewCard>
        ))
      ) : (
        <NoData>참여한 크루가 없습니다.</NoData>
      )}
    </CrewContainer>
  );
}

const CrewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px;
`;

const CrewCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const CrewName = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #333;
`;

const CrewInfo = styled.p`
  margin: 8px 0 0;
  font-size: 0.9em;
  color: #666;
`;

const NoData = styled.p`
  font-size: 1em;
  color: #999;
`;

export default CrewList;
