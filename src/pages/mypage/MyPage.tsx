import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import PersonalBadgeModal from "pages/badge/PersonalBadgeModal";
import CrewBadgeModal from "pages/badge/CrewBadgeModal";

const categories = [
  "내가 쓴 글",
  "좋아요 한 글",
  "내가 참여한 크루",
  "배틀 중",
];

function MyPage(): JSX.Element {
  const personalPoints = 75;
  const crewPoints = 50;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { state } = useAuth();
  const { token } = state;
  const navigate = useNavigate();
  const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
  const [isCrewModalOpen, setCrewModalOpen] = useState(false);

  const openPersonalModal = () => setPersonalModalOpen(true);
  const closePersonalModal = () => setPersonalModalOpen(false);

  const openCrewModal = () => setCrewModalOpen(true);
  const closeCrewModal = () => setCrewModalOpen(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Container>
      <Header>
        <IconWrapper>
          <FontAwesomeIcon icon={faUser} />
          <NickName>NickName</NickName>
        </IconWrapper>
        <Divider />
        <InfoBars>
          <Info>
            <h3>오늘 칼로리 (탄/단/지)</h3>
            <h1>In : 1300Kcal (30% / 42% / 28%)</h1>
            <h1>Out : 300Kcal </h1>
          </Info>
          <Info>
            <h3>목표 칼로리 (탄/단/지)</h3>
            <h1>15000Kcal (30% / 50% / 20%)</h1>
            <h1>500Kcal 더 먹을 수 있어요!</h1>
          </Info>
        </InfoBars>
        <Divider />
        <InfoBars>
          <Info onClick={openPersonalModal}>
            <h3>개인 활동 포인트 &nbsp; &gt;&gt; </h3>
            <ProgressBarWrapper>
              <ProgressBar progress={personalPoints} />
              <ProgressLabel>{personalPoints}점</ProgressLabel>
            </ProgressBarWrapper>
            <PersonalBadgeModal
              isOpen={isPersonalModalOpen}
              onClose={closePersonalModal}
            />
          </Info>
          <Info onClick={openCrewModal}>
            <h3>크루 활동 포인트 &nbsp; &gt;&gt; </h3>
            <ProgressBarWrapper>
              <ProgressBar progress={crewPoints} />
              <ProgressLabel>{crewPoints}점</ProgressLabel>
            </ProgressBarWrapper>
            <CrewBadgeModal isOpen={isCrewModalOpen} onClose={closeCrewModal} />
          </Info>
        </InfoBars>
        <Divider />
        <Category>
          {categories.map((category) => (
            <CategoryItem
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </Category>
        {selectedCategory && (
          <CategoryContent>
            <h3>{selectedCategory}</h3>
            <p>{`${selectedCategory}에 대한 상세 정보를 여기에 표시합니다.`}</p>
          </CategoryContent>
        )}
      </Header>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (min-width: 900px) {
    align-items: stretch;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  @media (min-width: 900px) {
    width: 30%;
    height: 100%;
    position: fixed;
    top: 10%;
    left: 0;
    background-color: #fafafa;
    border-right: 1px solid #ddd;
    padding: 40px 25px 0 25px;
    align-items: flex-start;
    overflow-y: auto;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
  font-size: 1.5em;

  @media (min-width: 900px) {
    align-self: center;
  }
`;

const NickName = styled.h2`
  margin: 0;
  font-size: 0.8em;
  color: #333;
`;

const Divider = styled.hr`
  width: 75%;
  border: none;
  border-top: 1.5px solid #999;
  margin: 16px 0;

  @media (min-width: 900px) {
    width: 100%;
  }
`;

const InfoBars = styled.div`
  width: 75%;
  display: flex;
  justify-content: space-between;
  text-align: center;
  cursor: pointer;

  @media (min-width: 900px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  text-align: center;

  h3 {
    margin: 4px 0;
    font-size: 0.9em;
    color: #666;
  }

  h1 {
    margin: 4px 0;
    font-size: 0.8em;
    color: #333;
  }

  @media (min-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 900px) {
    align-items: flex-start;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 70%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.progress}%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }

  &:hover {
    background-color: #a5a4a4;
    transition: background-color 0.3s ease;
  }

  @media (min-width: 900px) {
    width: 100%;
  }
`;

const ProgressLabel = styled.span`
  margin-top: 4px;
  font-size: 0.9em;
  color: #333;
`;

const Category = styled.div`
  width: 75%;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  text-align: center;

  @media (min-width: 900px) {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
`;

const CategoryItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  color: #333;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: 900px) {
    width: 100%;
    margin: 0;
    justify-content: flex-start;
    padding-left: 16px;
  }
`;

const CategoryContent = styled.div`
  width: 75%;
  margin-top: 16px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: left;

  h3 {
    margin-bottom: 8px;
    font-size: 1.2em;
    color: #333;
  }

  p {
    font-size: 1em;
    color: #666;
  }
`;

export default MyPage;
