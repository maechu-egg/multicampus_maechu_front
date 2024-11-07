import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext"; // useAuth import
import api from "../../services/api/axios";

interface Crew {
  crew_intro_img: string;
  crew_name: string;
  crew_title: string;
  crew_goal: string;
}

function HomePage(): JSX.Element {
  const { state } = useAuth(); // AuthContext에서 상태 가져오기
  const { token } = state; // 상태에서 token과 memberId 가져오기
  const [crewData, setCrewData] = useState<Crew[]>([]); // crewData의 타입을 Crew[]로 지정
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await api.get("/crew/list/homepage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCrewData(response.data); // 응답 데이터를 상태에 저장
          setIsDataFetched(true);
        } else {
          setIsLoggedIn(false); // 응답이 실패했을 때 로그인 상태를 false로 설정
        }
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다:", error);
        setIsLoggedIn(false); // 데이터를 가져오는 데 실패했을 때 로그인 상태를 false로 설정
      }
    };

    if (token) {
      fetchCrewData();
    } else {
      setIsLoggedIn(false); // 토큰이 없을 때 로그인 상태를 false로 설정
    }
  }, [token]);

  const fakeCrewData: Crew[] = [
    {
      crew_intro_img: "img/Home/homeEx1.png",
      crew_name: "00크루",
      crew_title: "00크루에서 0000한 크루원 모집합니다",
      crew_goal: "헬창",
    },
  ];

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
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="img/Home/Banner1.png"
                className="d-block w-100 carousel-image"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>
                  Some representative placeholder content for the first slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="img/Home/Banner3.png"
                className="d-block w-100 carousel-image"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Second slide label</h5>
                <p>
                  Some representative placeholder content for the second slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="img/Home/Banner2.png"
                className="d-block w-100 carousel-image"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Third slide label</h5>
                <p>
                  Some representative placeholder content for the third slide.
                </p>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </StyledSlider>
      <SwapSpot>
        <TextContainer>
          <h1>Swap-Spot</h1>
          <span>
            나에게 필요한 운동 기구/용품를 찾거나, 사용하지 않은 운동
            기구/용품을 공유해보세요 !
          </span>
        </TextContainer>
      </SwapSpot>
      <SwapSpot>
        <TextContainer>
          <h1>Today Best - 오운완!</h1>
          <span>
            워크스페이스의 다양한 운동인들의 운동인증, 기록을 통해 베스트 오운완
            회원이 되세요 !
          </span>
        </TextContainer>
      </SwapSpot>
      <LocalCrew>
        <Title>
          <TextContainer>
            <h1>My Hometown, New Crew</h1>
            <span>
              바로 내 지역, 근처에서 모집 중인 최신 크루들을 찾아보세요 !
            </span>
            {!isLoggedIn && (
              <WarningMessage>
                회원 전용 정보입니다. 로그인 해주세요
              </WarningMessage>
            )}
          </TextContainer>
          <IconWrapper>
            <FontAwesomeIcon icon={faArrowRight} />
          </IconWrapper>
        </Title>
        <Cards isLoggedIn={isLoggedIn}>
          {(isLoggedIn && isDataFetched ? crewData : fakeCrewData).map(
            (crew, index) => (
              <div className="card" key={index}>
                <img
                  src={crew.crew_intro_img}
                  className="card-img-top card-image"
                  alt={crew.crew_name}
                />
                <div className="card-body">
                  <h5 className="card-title">{crew.crew_name}</h5>
                  <p className="card-text">{crew.crew_title}</p>
                  <p className="card-goal">목표: {crew.crew_goal}</p>
                  <a href="#" className="btn btn-secondary">
                    자세히 보기
                  </a>
                </div>
              </div>
            )
          )}
        </Cards>
      </LocalCrew>
    </Container>
  );
}

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

  .carousel-inner {
    width: 100%;
    height: 100%;
  }

  .carousel-item {
    height: 100%;
  }

  .carousel-image {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }

  .carousel-control-prev,
  .carousel-control-next {
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 5%;
  }

  .carousel-control-prev {
    left: 10px;
  }

  .carousel-control-next {
    right: 10px;
  }
`;

const SwapSpot = styled.div`
  width: 80%;
  margin-top: 70px;
`;

const LocalCrew = styled.div`
  width: 80%;
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

const Cards = styled.div<{ isLoggedIn: boolean }>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  filter: ${({ isLoggedIn }) => (isLoggedIn ? "none" : "blur(4px)")};

  .card {
    width: 18rem;
    flex: 1 1 30%;
    overflow: hidden;
    margin: 15px;
  }

  .card-image {
    max-height: 250px;
    object-fit: cover;
  }

  @media (max-width: 992px) {
    .card {
      flex: 1 1 45%;
    }
  }

  @media (max-width: 768px) {
    .card {
      flex: 1 1 100%;
    }
  }
`;

export default HomePage;
