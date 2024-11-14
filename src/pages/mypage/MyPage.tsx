import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import PersonalBadgeModal from "pages/badge/PersonalBadgeModal";
import CrewBadgeModal from "pages/badge/CrewBadgeModal";
import api from "../../services/api/axios";
import PostList from "./PostList";
import CrewList from "./mypageComponent/CrewList";
import BattleList from "./mypageComponent/BattleList";
import AccountModal from "./mypageComponent/AccountModal";
const BASE_URL = "http://localhost:8001";

const categories = ["내가 쓴 글", "좋아요 한 글", "참여한 크루", "배틀 중"];

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

function MyPage(): JSX.Element {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { token, memberId } = state;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [kcalInfo, setKcalInfo] = useState<todayRecord | null>(null);
  const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
  const [isCrewModalOpen, setCrewModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [personalPoints, setPersonalPoints] = useState(0);
  const [crewPoints, setCrewPoints] = useState(0);
  const [personalLevel, setPersonalLevel] = useState("기본");
  const [crewLevel, setCrewLevel] = useState("기본");
  const [postData, setPostData] = useState<any[]>([]);
  const [crewData, setCrewData] = useState<any[]>([]);
  const [battleData, setBattleData] = useState<any[]>([]);

  const openPersonalModal = () => setPersonalModalOpen(true);
  const closePersonalModal = () => setPersonalModalOpen(false);
  const openCrewModal = () => setCrewModalOpen(true);
  const closeCrewModal = () => setCrewModalOpen(false);
  const openaccountModal = () => setAccountModalOpen(true);
  const closeAccountModal = () => setAccountModalOpen(false);

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    let endpoint = "";
    if (category === "내가 쓴 글") {
      endpoint = "/community/myPage/myPosts";
    } else if (category === "좋아요 한 글") {
      endpoint = "/community/myPage/myLikePosts";
    } else if (category === "참여한 크루") {
      endpoint = "/crew/my";
    } else if (category === "배틀 중") {
      endpoint = "/crew/battle/list/my";
    }

    if (endpoint) {
      try {
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (category === "참여한 크루") {
          console.log("내 크루 응답 : ", response.data);
          setCrewData(response.data.list); // CrewList에 사용할 데이터
        } else if (category === "배틀 중") {
          console.log("내 배틀 응답 : ", response.data);
          setBattleData(response.data); // BattleList에 사용할 데이터
        } else {
          setPostData(response.data.list);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const userInfo = async () => {
      try {
        const response = await api.get("/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
        console.log("사용자 정보 조회 응답 데이터 : ", response.data);
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
      }
    };
    userInfo();
  }, [token, state]);

  useEffect(() => {
    const userKcalInfo = async () => {
      try {
        const response = await api.get("/record/summary/daily", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKcalInfo(response.data);
      } catch (error) {
        console.error("사용자 칼로리 조회 오류:", error);
      }
    };
    userKcalInfo();
  }, [token, state]);

  useEffect(() => {
    const userPoint = async () => {
      try {
        const response = await api.get("/badges/getBadge", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { current_points, crew_current_points } = response.data;
        setPersonalPoints(current_points);
        setCrewPoints(crew_current_points);
        setPersonalLevel(getLevelLabel(current_points));
        setCrewLevel(getLevelLabel(crew_current_points));
      } catch (error) {
        console.log("사용자별 포인트 조회 오류:", error);
      }
    };
    userPoint();
  }, [token, state]);

  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
  };

  return (
    <Container>
      <Header>
        {userInfo ? (
          <IconWrapper onClick={openaccountModal}>
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
        {isAccountModalOpen && (
          <AccountModal
            isOpen={isAccountModalOpen}
            onClose={closeAccountModal}
            userInfo={userInfo}
          />
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
              <ProgressLabel>
                {personalPoints}점 - {personalLevel}
              </ProgressLabel>
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
              <ProgressLabel>
                {crewPoints}점 - {crewLevel}
              </ProgressLabel>
            </ProgressBarWrapper>
            <CrewBadgeModal isOpen={isCrewModalOpen} onClose={closeCrewModal} />
          </Info>
        </InfoBars>
        <Divider />
        <Category>
          {categories.map((category) => (
            <CategoryItem
              key={category}
              isSelected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </Category>
      </Header>
      <Content>
        {selectedCategory === "내가 쓴 글" ||
        selectedCategory === "좋아요 한 글" ? (
          <PostList postData={postData} />
        ) : selectedCategory === "참여한 크루" ? (
          <CrewList crewData={crewData} />
        ) : selectedCategory === "배틀 중" ? (
          <BattleList battleData={battleData} /> // battleData가 제대로 전달되었는지 확인
        ) : null}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100%;
  background-color: #b6c0d3;

  @media (min-width: 900px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 0.8px solid #666;
  background-color: #f4f4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding-top: 20px;

  @media (min-width: 900px) {
    width: 30%;
    height: 100%;
    position: fixed;
    top: 10%;
    left: 0;
    background-color: #f4f4f4;
    border-right: 1px solid #ddd;
    padding: 40px 25px 80px 25px;
    align-items: flex-start;
    overflow-y: auto;
  }
`;

const Content = styled.div`
  width: 80%;
  height: 1000px;
  @media (min-width: 900px) {
    margin-left: 30%;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
  font-size: 1.5em;
  cursor: pointer;

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
  width: 80%;
  border: none;
  border-top: 1.5px solid #777;
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
  width: 85%;
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
    width: ${(props) => Math.min(props.progress, 100)}%;
    background-color: #1d2636;
    transition: width 0.3s ease;
  }

  &:hover {
    background-color: #a5a4a4;
    transition: background-color 0.3s ease;
  }
`;

const ProgressLabel = styled.span`
  margin-top: 4px;
  font-size: 0.9em;
  color: #333;
`;

const Category = styled.div`
  width: 75%;
  display: flex;
  justify-content: space-between;
  text-align: center;

  @media (min-width: 900px) {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
`;

const CategoryItem = styled.div<{ isSelected: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  color: #333;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: ${(props) => (props.isSelected ? "2px solid #333" : "none")};

  &:hover {
    border-bottom: 2px solid #333;
  }

  @media (min-width: 900px) {
    width: 100%;
    margin: 0;
    justify-content: flex-start;
    padding-left: 16px;
  }
`;

export default MyPage;
