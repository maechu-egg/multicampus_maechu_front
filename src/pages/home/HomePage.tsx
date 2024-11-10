import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api/axios";

interface Crew {
  crew_id: number;
  crew_intro_img: string;
  crew_name: string;
  crew_title: string;
  crew_goal: string;
}

interface Swap {
  post_id: number;
  post_nickname: string; //작성자
  post_title: string; //제목
  post_views: number; // 조회수
  post_like_counts: number; //좋아요 수
  post_date: string; // 작성날짜
  post_sport: string; // 운동 대분류 키워드
}

interface TodayWorkout {
  post_id: number;
  post_title: string;
  post_sport: string; //운동 키워드
  post_img1: string;
  post_views: number; // 조회수
  post_like_counts: number; //좋아요 수
  post_nickname: string; //작성자
}

const fakeCrewData: Crew[] = [
  {
    crew_id: 1,
    crew_intro_img: "img/Home/homeEx1.png",
    crew_name: "00크루",
    crew_title: "00크루에서 0000한 크루원 모집합니다",
    crew_goal: "헬창",
  },
];

// 날짜 형식을 변환하는 헬퍼 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const day = String(date.getDate()).padStart(2, "0"); // 일
  const hours = String(date.getHours()).padStart(2, "0"); // 시
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 분
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

function HomePage(): JSX.Element {
  const { state } = useAuth();
  const { token } = state;
  const [crewData, setCrewData] = useState<Crew[]>([]);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const [swapData, setSwapData] = useState<Swap[]>([]);
  const [isSwapDataLoading, setIsSwapDataLoading] = useState<boolean>(true);
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout[]>([]);

  useEffect(() => {
    const getSwapData = async () => {
      setIsSwapDataLoading(true);
      try {
        const response = await api.get(
          "/community/home/posts/searchMarketplace"
        );
        console.log("중고거래 키워드 응답 : ", response.data);
        if (response.status === 200) {
          // swapData에 list 속성의 배열을 저장
          setSwapData(response.data.list || []);
        }
      } catch (error) {
        console.log("swap 데이터를 가져오는데 실패했습니다.", error);
      } finally {
        setIsSwapDataLoading(false);
      }
    };
    getSwapData();
  }, [token]);

  useEffect(() => {
    const getTodayData = async () => {
      try {
        const response = await api.get("/community/home/posts/searchToday");
        console.log("오운완 데이터 응답: ", response.data);
        if (response.status === 200) {
          setTodayWorkout(response.data.list || []);
        }
      } catch (error) {
        console.log("오운완 데이터를 가져오는데 실패했습니다.", error);
      }
    };
    getTodayData();
  }, [token]);

  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await api.get("/crew/list/homepage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("지역 별 크루 추천 응답: ", response.data);

        if (response.status === 200) {
          setCrewData(response.data);
          setIsDataFetched(true);
        } else {
          setIsDataFetched(false); // Fall back to fake data if the status is not 200
        }
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다:", error);
        setIsDataFetched(false); // Fall back to fake data if an error occurs
      }
    };

    if (token) {
      fetchCrewData();
    } else {
      setIsDataFetched(false); // If no token, fall back to fake data
    }
  }, [token]);

  return (
    <Container>
      <WorkSpace>
        <Title>
          <TextContainer>
            <h1>Today Best - 오운완!</h1>
            <span>
              워크스페이스의 다양한 운동인들의 운동인증, 기록을 통해 베스트
              오운완 회원이 되세요 !
            </span>
          </TextContainer>
          <IconWrapper>
            <FontAwesomeIcon icon={faArrowRight} />
          </IconWrapper>
        </Title>
        <CardContainer>
          <CardSlider>
            {todayWorkout.concat(todayWorkout).map((workout, index) => (
              <Card
                key={index}
                backgroundImage={
                  workout.post_img1 ?? "/img/default/workDefault1.png"
                }
                isCenter={
                  index % todayWorkout.length ===
                  Math.floor(todayWorkout.length / 2)
                }
              >
                <CardContent>
                  <h3>{workout.post_title}</h3>
                  <p>By: {workout.post_nickname}</p>
                  <Info>
                    <span>
                      <FontAwesomeIcon icon={faThumbsUp} />{" "}
                      {workout.post_like_counts}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faEye} /> {workout.post_views}
                    </span>
                  </Info>
                </CardContent>
              </Card>
            ))}
          </CardSlider>
        </CardContainer>
      </WorkSpace>
    </Container>
  );
}

const slideAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WorkSpace = styled.div`
  width: 80%;
  margin-top: 100px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  margin-top: 50px;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
`;

const CardSlider = styled.div`
  display: flex;
  animation: ${slideAnimation} 30s linear infinite;
`;

const Card = styled.div<{ backgroundImage: string; isCenter: boolean }>`
  min-width: 280px;
  height: 330px;
  margin-right: 20px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  align-self: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
  transform: ${(props) => (props.isCenter ? "scale(1.1)" : "scale(1)")};
  filter: ${(props) => (props.isCenter ? "brightness(1)" : "brightness(0.7)")};

  &:hover {
    transform: scale(1.09);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const CardContent = styled.div`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 15px;
  border-radius: 0 0 15px 15px;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;

  h1 {
    font-weight: 900;
    margin: 0;
  }

  span {
    font-weight: 400;
    font-size: 1rem;
    color: #555;
  }
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  margin-left: auto;
  padding-right: 60px;
`;

export default HomePage;
