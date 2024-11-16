import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api/axios";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      <StyledSlider>
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-indicators">
            {[...Array(3)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={idx}
                className={idx === 0 ? "active" : ""}
                aria-current={idx === 0 ? "true" : undefined}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>

          <CarouselInner className="carousel-inner">
            {["Banner1.png", "Banner3.png", "Banner2.png"].map(
              (imgSrc, idx) => (
                <div
                  key={idx}
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                >
                  <img
                    src={`img/Home/${imgSrc}`}
                    className="d-block w-100 carousel-image"
                    alt={`Slide ${idx + 1}`}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>{`Slide ${idx + 1} label`}</h5>
                    <p>
                      Some representative placeholder content for slide{" "}
                      {idx + 1}.
                    </p>
                  </div>
                </div>
              )
            )}
          </CarouselInner>

          <CarouselControl
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
            position="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </CarouselControl>

          <CarouselControl
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
            position="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </CarouselControl>
        </div>
      </StyledSlider>
      <LocalCrew>
        <Title>
          <TextContainer>
            <h1>My Hometown, New Crew</h1>
            <span>
              바로 내 지역, 근처에서 모집 중인 최신 크루들을 찾아보세요 !
            </span>
            {!isDataFetched && (
              <WarningMessage>
                회원 전용 정보입니다. 회원가입 및 로그인 해주세요
              </WarningMessage>
            )}
          </TextContainer>
          <IconWrapper>
            <FontAwesomeIcon
              icon={faArrowRight}
              onClick={() => navigate("/crewpage")}
            />
          </IconWrapper>
        </Title>
        <Cards isBlurred={!isDataFetched}>
          {(isDataFetched ? crewData : fakeCrewData).map((crew, index) => (
            <div className="card" key={index}>
              <img
                src={
                  crew.crew_intro_img === "/static/CrewDefault"
                    ? "/img/Home/homeEx1.png"
                    : crew.crew_intro_img
                }
                className="card-img-top card-image"
                alt={crew.crew_name}
              />
              <div className="card-body">
                <h5 className="card-title">{crew.crew_name}</h5>
                <p className="card-text">{crew.crew_title}</p>
                <p className="card-goal">목표: {crew.crew_goal}</p>
                <a href="#" className="btn btn-outline-dark">
                  자세히 보기
                </a>
              </div>
            </div>
          ))}
        </Cards>
      </LocalCrew>
      <SwapSpot>
        <Title>
          <TextContainer>
            <h1>Swap-Spot</h1>
            <span>
              나에게 필요한 운동 기구/용품를 찾거나, 사용하지 않은 운동
              기구/용품을 공유해보세요 !
            </span>
          </TextContainer>
          <IconWrapper>
            <FontAwesomeIcon icon={faArrowRight} />
          </IconWrapper>
        </Title>
        <div className="list-group">
          {isSwapDataLoading ? (
            <p>중고거래 데이터를 불러오는 중입니다...</p>
          ) : swapData.length > 0 ? (
            swapData.slice(0, 4).map((swap, index) => (
              <a
                href="#"
                className="list-group-item list-group-item-action"
                key={index}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{swap.post_title}</h5>
                  <small className="text-body-secondary">
                    {formatDate(swap.post_date)}
                  </small>
                </div>
                <p className="mb-2">작성자: {swap.post_nickname}</p>
                <small className="text-body-secondary">
                  조회수: {swap.post_views} | 좋아요: {swap.post_like_counts}
                </small>
              </a>
            ))
          ) : (
            <p>등록된 중고거래 게시물이 없습니다.</p>
          )}
        </div>
      </SwapSpot>
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
            {todayWorkout.map((workout, index) => (
              <Card
                key={index}
                backgroundImage={
                  workout.post_img1 ?? "/img/default/workDefault1.png"
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

const StyledSlider = styled.div`
  width: 90%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  border-radius: 20px;
  overflow: hidden;

  .carousel {
    width: 100%;
    height: 100%;
  }
`;

const CarouselInner = styled.div`
  width: 100%;
  height: 100%;

  .carousel-item {
    height: 100%;
  }

  .carousel-image {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const CarouselControl = styled.button<{ position: "prev" | "next" }>`
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 5%;
  position: absolute;
  ${({ position }) => position}: 10px;

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    display: inline-block;
    width: 100%;
  }
`;

const SwapSpot = styled.div`
  width: 80%;
  margin-top: 100px;

  .list-group {
    margin-top: 40px;

    .list-group-item {
      height: 100px;
      margin-bottom: 10px;
      padding: 10px 20px 10px 20px;
      background-color: #fff;
      border: none;
      border-radius: 20px;
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
    }
  }
`;

const WorkSpace = styled.div`
  width: 85%;
  margin-top: 100px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  margin-top: 50px;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
`;

const CardSlider = styled.div`
  display: flex;
  animation: ${slideAnimation} 30s linear infinite;
`;

const Card = styled.div<{ backgroundImage: string }>`
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

  &:hover {
    transform: scale(1.05);
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

const LocalCrew = styled.div`
  width: 85%;
  margin-top: 70px;
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

const WarningMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  margin-left: auto;
  padding-right: 60px;
`;

const Cards = styled.div<{ isBlurred: boolean }>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  filter: ${({ isBlurred }) => (isBlurred ? "blur(4px)" : "none")};

  .card {
    flex: 1 1 30%;
    max-width: 100%;
    overflow: hidden;
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 10px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px); /* 살짝 위로 이동 */
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
    }
  }

  .card-image {
    max-height: 200px;
    object-fit: cover;
    opacity: 0.9; /* 기본 흐림 */
    filter: grayscale(20%); /* 약간의 회색 필터 */
    transition:
      opacity 0.3s ease,
      filter 0.3s ease;

    /* Hover 시 이미지 선명하게 */
    .card:hover & {
      opacity: 1;
      filter: grayscale(0%);
    }
  }

  .card-body {
    padding: 15px;
    text-align: center;

    .btn {
      background-color: #1d2636;
      color: #fff;
      border: none;

      transition:
        background-color 0.3s ease,
        color 0.3s ease;

      &:hover {
        background-color: #414d60;
        color: #e0e0e0;
      }
    }
  }

  /* 반응형 */
  @media (max-width: 1100px) {
    .card {
      flex: 1 1 45%;
    }
  }

  @media (max-width: 700px) {
    .card {
      flex: 1 1 100%;
    }
  }
`;

export default HomePage;
