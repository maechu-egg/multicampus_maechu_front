import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function HomePage(): JSX.Element {
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
      <LocalCrew>
        <Title>
          <TextContainer>
            <h1>My Hometown, New Crew</h1>
            <span>
              바로 내 지역, 근처에서 모집 중인 최신 크루들을 찾아보세요!
            </span>
          </TextContainer>
          <IconWrapper>
            <FontAwesomeIcon icon={faArrowRight} />
          </IconWrapper>
        </Title>
        <Cards>
          <div className="card">
            <img
              src="img/Home/homeEx1.png"
              className="card-img-top card-image"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">전북권 한사랑 산악회</h5>
              <p className="card-text">
                전북권 주말 아침 등산하는 직장인을 모집합니다 ~!
                <br /> ** 점심 제공 **
              </p>
              <a href="#" className="btn btn-secondary">
                Go somewhere
              </a>
            </div>
          </div>
          <div className="card">
            <img
              src="img/Home/homeEx1.png"
              className="card-img-top card-image"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">전북권 한사랑 산악회</h5>
              <p className="card-text">
                전북권 주말 아침 등산하는 직장인을 모집합니다 ~!
                <br /> ** 점심 제공 **
              </p>
              <a href="#" className="btn btn-secondary">
                Go somewhere
              </a>
            </div>
          </div>
          <div className="card">
            <img
              src="img/Home/homeEx1.png"
              className="card-img-top card-image"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">전북권 한사랑 산악회</h5>
              <p className="card-text">
                전북권 주말 아침 등산하는 직장인을 모집합니다 ~!
                <br /> ** 점심 제공 **
              </p>
              <a href="#" className="btn btn-secondary">
                Go somewhere
              </a>
            </div>
          </div>
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

const LocalCrew = styled.div`
  width: 90%;
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

const IconWrapper = styled.div`
  font-size: 1.5rem;
  margin-left: auto;
  padding-right: 60px;
`;

const Cards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;

  .card {
    width: 18rem;
    flex: 1 1 30%;
    overflow: hidden;
    margin: 15px;
  }

  .card-image {
    max-height: 250px; /* Set max-height to control image size */
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
