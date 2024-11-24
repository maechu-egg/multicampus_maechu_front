import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CrewJoinModal from "components/ui/crew/modal/CrewJoinModal";

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
const BASE_URL = "https://workspace.kr.object.ncloudstorage.com/";

function CrewList({ crewData = [] }: CrewListProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);

  const handleCrewDetailClick = (crewId: number) => {
    setSelectedCrewId(crewId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrewId(null);
  };
  return (
    <CrewContainer>
      {crewData.length > 0 ? (
        crewData.map((crew) => (
          <CrewCard
            key={crew.crew_id}
            onClick={() => handleCrewDetailClick(crew.crew_id)}
          >
            <ImageWrapper>
              <CrewImage
                src={
                  crew.crew_intro_img === "/static/CrewDefault"
                    ? "/img/default/CrewDefault.png"
                    : `${BASE_URL}${crew.crew_intro_img}`
                }
                alt="Crew intro"
              />
            </ImageWrapper>
            <CrewName>{crew.crew_name || "이름 없음"}</CrewName>
            <CrewTitle>{crew.crew_title || "타이틀 없음"}</CrewTitle>
            <CrewInfo>
              <strong>목표:</strong> {crew.crew_goal || "목표 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>위치:</strong> {crew.crew_location || "위치 정보 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>운동 종류:</strong> {crew.crew_sport || "운동 종류 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>성별:</strong> {crew.crew_gender || "성별 정보 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>나이대:</strong> {crew.crew_age || "나이 정보 없음"}
            </CrewInfo>
            <CrewInfo>
              <strong>활동 빈도:</strong>{" "}
              {crew.crew_frequency || "빈도 정보 없음"}
            </CrewInfo>
          </CrewCard>
        ))
      ) : (
        <NoData>참여한 크루가 없습니다.</NoData>
      )}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalBody>
              {selectedCrewId !== null && (
                <CrewJoinModal crew_id={selectedCrewId} />
              )}
            </ModalBody>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </CrewContainer>
  );
}

// Styled Components
const CrewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const CrewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 400px;
  padding: 16px;
  border: 1px solid grey;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 100px;
  height: 100px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CrewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CrewName = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #333;
  text-align: center;
`;

const CrewTitle = styled.h4`
  margin: 4px 0;
  font-size: 1em;
  color: #555;
  font-weight: normal;
  text-align: center;
`;

const CrewInfo = styled.p`
  margin: 4px 0;
  font-size: 0.9em;
  color: #666;
  text-align: center;
`;

const NoData = styled.p`
  font-size: 1em;
  color: #999;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 70%;
  max-width: 500px;
  max-height: 80vh;
  margin-top: 50px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalBody = styled.div`
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default CrewList;
