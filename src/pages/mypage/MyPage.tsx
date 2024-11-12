import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import PersonalBadgeModal from "pages/badge/PersonalBadgeModal";
import CrewBadgeModal from "pages/badge/CrewBadgeModal";
import api from "../../services/api/axios";
const BASE_URL = "http://localhost:8001";

const categories = [
  "내가 쓴 글",
  "좋아요 한 글",
  "내가 참여한 크루",
  "배틀 중",
];

interface todayRecord {
  burnedCalories: number;
  consumed: {
    calorie: number;
    carb: number;
    fat: number;
    protein: number;
    quantity: number;
  };
  recommended: {
    bmr: number;
    carbRate: number;
    fatRate: number;
    goal: string;
    proteinRate: number;
    recommendedCalories: number;
    recommendedCarb: number;
    recommendedFat: number;
    recommendedProtein: number;
    tdee: number;
    weight: number;
  };
}

const personalPoints = 75;
const crewPoints = 50;
function MyPage(): JSX.Element {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { state } = useAuth();
  const { token, memberId } = state;
  const [userInfo, setUserInfo] = useState<any>(null);
  const [kcalInfo, setKcalInfo] = useState<todayRecord | null>(null);
  const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
  const [isCrewModalOpen, setCrewModalOpen] = useState(false);

  const openPersonalModal = () => setPersonalModalOpen(true);
  const closePersonalModal = () => setPersonalModalOpen(false);

  const openCrewModal = () => setCrewModalOpen(true);
  const closeCrewModal = () => setCrewModalOpen(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const userInfo = async () => {
      try {
        console.log("함수 실행 시 현재 상태:", { token, memberId }); // 함수 실행 시 현재 상태 출력
        const response = await api.get("/info", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          },
        });

        console.log("사용자 정보 응답:", response.data); // 응답 데이터 콘솔 출력
        setUserInfo(response.data); // 사용자 정보 상태 업데이트
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
      }
    };
    userInfo();
  }, [token, state]);

  useEffect(() => {
    const userKcalInfo = async () => {
      try {
        console.log("함수 실행 시 현재 상태:", { token, memberId }); // 함수 실행 시 현재 상태 출력
        const response = await api.get("/record/summary/daily", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          },
        });
        console.log("하루 칼로리 정보 응답 : ", response.data);
        setKcalInfo(response.data);
      } catch (error) {
        console.error("사용자 칼로리 조회 오류:", error);
      }
    };
    userKcalInfo();
  }, [token, state]);

  return (
    <Container>
      <Header>
        {userInfo ? (
          <IconWrapper>
            <ProfileImage
              src={
                userInfo.memberImg === "/static/null"
                  ? "/img/default/UserDefault.png"
                  : `${BASE_URL}${userInfo.memberImg}`
              }
              alt="Profile"
            />
            <NickName>{userInfo.nickname}</NickName>
          </IconWrapper>
        ) : (
          <p>사용자 정보를 불러오는 중...</p>
        )}

        <Divider />
        {kcalInfo ? (
          <InfoBars>
            <Info>
              <h3>오늘 칼로리 (탄/단/지)</h3>
              <h1>
                In : {kcalInfo.consumed.calorie}Kcal ({kcalInfo.consumed.carb}%
                / {kcalInfo.consumed.protein}% / {kcalInfo.consumed.fat}%)
              </h1>
              <h1>Out : {kcalInfo.burnedCalories}Kcal </h1>
            </Info>
            <Info>
              <h3>목표 칼로리 (탄/단/지)</h3>
              <h1>
                {kcalInfo.recommended.recommendedCalories}Kcal (
                {kcalInfo.recommended.carbRate * 100}% /{" "}
                {kcalInfo.recommended.proteinRate * 100}% /{" "}
                {kcalInfo.recommended.fatRate * 100}%)
              </h1>
              <h1>
                {kcalInfo.recommended.recommendedCalories -
                  kcalInfo.consumed.calorie}
                Kcal 더 먹을 수 있어요!
              </h1>
            </Info>
          </InfoBars>
        ) : (
          <p>칼로리 정보를 불러오는 중...</p>
        )}
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

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
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
