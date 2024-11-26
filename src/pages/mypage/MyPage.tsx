import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import PersonalBadgeModal from "pages/badge/PersonalBadgeModal";
import CrewBadgeModal from "pages/badge/CrewBadgeModal";
import api from "../../services/api/axios";
import PostList from "./mypageComponent/PostList";
import CrewList from "./mypageComponent/CrewList";
import BattleList from "./mypageComponent/BattleList";
import AccountModal from "./mypageComponent/AccountModal";
import ProfileModal from "./mypageComponent/ProfileModal";
import { Link, useNavigate } from "react-router-dom";

import { usePost } from "hooks/community/usePost";

const BASE_URL = "https://workspace.kr.object.ncloudstorage.com/";

const categories = ["내가 쓴 글", "좋아요 한 글", "참여한 크루", "배틀 중"];
interface ProfileData {
  member_id: number;
  profile_age: number;
  profile_allergy: string;
  profile_gender: string;
  profile_goal: string;
  profile_height: number;
  profile_id: number;
  profile_region: string;
  profile_sport1: string;
  profile_sport2: string;
  profile_sport3: string;
  profile_weight: number;
  profile_workout_frequency: number;
}

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

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  comment_like_status: boolean;
  comment_dislike_status: boolean;
  commentAuthor: boolean;
}

interface Post {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments_count: number;
  comments: Comment[];
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword: string;
  post_hashtag: string;
  post_like_counts: number;
  isRecommended?: boolean;
  likeStatus: boolean;
  unlikeStatus: boolean;
  post_img1: string;
  post_img2: string;
  post_unlike_counts: number;
  member_id: number;
  author: boolean;
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;

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
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [personalPoints, setPersonalPoints] = useState(0);
  const [crewPoints, setCrewPoints] = useState(0);
  const [personalLevel, setPersonalLevel] = useState("기본");
  const [crewLevel, setCrewLevel] = useState("기본");
  const [crewData, setCrewData] = useState<any[]>([]);
  const [battleData, setBattleData] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const openPersonalModal = () => setPersonalModalOpen(true);
  const closePersonalModal = () => setPersonalModalOpen(false);
  const openCrewModal = () => setCrewModalOpen(true);
  const closeCrewModal = () => setCrewModalOpen(false);
  const openAccountModal = () => setAccountModalOpen(true);
  const closeAccountModal = () => setAccountModalOpen(false);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

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
          setCrewData(response.data); // CrewList에 사용할 데이터
        } else if (category === "배틀 중") {
          console.log("내 배틀 응답 : ", response.data);
          setBattleData(response.data); // BattleList에 사용할 데이터
        } else {
          console.log("커뮤니티 정보 : ", response.data.list);
          setPosts(response.data.list);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      console.log("사용자 계정 정보 조회 : ", response.data);
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Callback to refresh user info
  const refreshUserInfo = () => {
    fetchUserInfo();
  };

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

  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await api.get("/profile/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("사용자 프로필 내역 조회 : ", response.data);
        setProfileData(response.data);
      } catch (error) {
        console.log("사용자별 프로필 조회 오류:", error);
      }
    };
    userProfile();
  }, [token, state]);

  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
  };
  const handleKcal = () => {
    navigate("/recordpage");
  };

  return (
    <Container>
      <Header>
        {userInfo ? (
          <>
            <FlexRowContainer>
              <IconWrapper onClick={openAccountModal}>
                <AccountIcon
                  src="/img/default/Account.png"
                  alt="Account Icon"
                />
                <ProfileImage
                  src={
                    userInfo.memberImg === null
                      ? "/img/default/UserDefault.png"
                      : `${BASE_URL}${userInfo.memberImg}`
                  }
                  alt="Profile"
                  onError={(e) => {
                    console.error("Image load error:", e);
                    console.log(
                      "Failed URL:",
                      `${BASE_URL}${userInfo.memberImg}`
                    );
                  }}
                  onLoad={() => {
                    console.log(
                      "Image loaded:",
                      `${BASE_URL}${userInfo.memberImg}`
                    );
                  }}
                />
                <NickName>{userInfo.nickname}</NickName>
              </IconWrapper>
              <ProfileButton onClick={openProfileModal}>Profile</ProfileButton>
            </FlexRowContainer>
            {isProfileModalOpen && profileData && (
              <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={closeProfileModal}
                profileData={profileData}
              />
            )}
          </>
        ) : (
          <p>사용자 정보를 불러오는 중...</p>
        )}
        {isAccountModalOpen && (
          <AccountModal
            isOpen={isAccountModalOpen}
            onClose={closeAccountModal}
            userInfo={userInfo}
            onUpdate={refreshUserInfo}
          />
        )}

        <Divider />
        {kcalInfo ? (
          <InfoBars onClick={handleKcal}>
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
          <PostList postData={posts} />
        ) : selectedCategory === "참여한 크루" ? (
          <CrewList crewData={crewData} />
        ) : selectedCategory === "배틀 중" ? (
          <BattleList battleData={battleData} />
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
  z-index: 4;

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding-top: 20px;

  @media (min-width: 900px) {
    width: 30%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    border-right: 1px solid #ddd;

    padding: 130px 25px 80px 25px;
    align-items: flex-start;
    overflow-y: auto;
  }
`;
const FlexRowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
`;

const AccountIcon = styled.img`
  width: 30px;
  height: 30px;
  position: absolute;
  margin-left: -20px;
  margin-top: -30px;
`;

const Content = styled.div`
  margin-top: 30px;
  width: 75%;
  height: 1000px;

  @media (min-width: 900px) {
    margin-left: 30%;
  }
  @media(max-width:900px){
    width:95%;
  }

`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const ProfileButton = styled.button`
  background-color: #1d2636;
  color: #fff;
  border: none;

  padding: 10px;
  margin-left: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #414d60;
    color: #e0e0e0;
  }
`;

const NickName = styled.h2`
 margin: 0;
 font-size: 0.8em;
 color: #333;
 white-space: normal;
 overflow: visible;
 text-overflow: clip;
 /* 520px부터 300px*/
@media (max-width: 520px) and (min-width: 300px) {
   max-width: calc(80px + (100vw - 300px) * 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
  /* 900px 이상 */
 @media (min-width: 900px) {
   max-width: calc(80px + (100vw - 900px) * 0.25);
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }
  /* 1200px 이상일 때 최대 너비 제한 */
 @media (min-width: 1780px) {
   max-width: 350px;
 }`;

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
    padding-top: 10px;
  }
  @media(max-width:495px){
    h3{
      font-size:0.8em
    }
    h1{
      font-size:0.7em
    }
  }
  @media(max-width:439px){
    h3{
      font-size:0.7em
    }
    h1{
     font-size:0.6em
    }
  }
  @media(max-width:365px){
    h3{
      font-size:0.65em
    }
    h1{
      font-size:0.55em
    }
  }
  @media(max-width:335px){
    h3{
     font-size:0.6em
    }
    h1{
      font-size:0.5em
    }
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 900px) {
    align-items: flex-center;
    width: 100%;
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

  @media (min-width: 900px) {
    align-items: center;
    text-align: center;
    padding-top: 10px;
  }
  @media(max-width:495px){
    height:16px;
  }

`;

const ProgressLabel = styled.span`
  margin-top: 4px;
  font-size: 0.9em;
  color: #333;

  @media(max-width:495px){
    font-size:0.85em
  }
  @media(max-width:439px){
    font-size:0.8em
  }
  @media(max-width:365px){
    font-size:0.75em
  }
  @media(max-width:335px){
    font-size:0.7em
  }
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
  padding-bottom: 25px;
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
  @media (max-width:480px){
    font-size:0.9em;
  }
  @media(max-width:450px){
    font-size:0.8em;
  }
  @media(max-width:380px){
    font-size:0.75em;
  }
  @media(max-width:340px){
    font-size:0.7em;
  }
  @media(max-width:325px){
    font-size:0.65em;
  }
`;

export default MyPage;
