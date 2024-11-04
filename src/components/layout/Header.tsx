import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const MainLogo = process.env.PUBLIC_URL + "/img/Mainlogo.png";

function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false);
  const [animate, setAnimate] = useState(false);
  const HeaderRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isClickMenuBtn) {
      setTimeout(() => setAnimate(false), 300);
    }
  }, [isClickMenuBtn]);

  const handleMenuToggle = () => {
    setIsClickMenuBtn(!isClickMenuBtn);
    setAnimate(true);
  };

  return (
    <Container ref={HeaderRef} className={isScrolled ? "scrolled" : ""}>
      <Link to="/">
        <Logo src={MainLogo} alt="Main Logo" />
      </Link>
      <Tabs $isClickMenuBtn={isClickMenuBtn} $animate={animate}>
        <Tab>
          <Link to="/communitypage">커뮤니티</Link>
        </Tab>
        <Tab>
          <Link to="/crewpage">운동 크루 </Link>
        </Tab>
        <Tab>
          <Link to="/aboutpage">워크스페이스</Link>
        </Tab>
        <Tab>
          <Link to="/recodepage">나의 기록</Link>
        </Tab>
      </Tabs>

      <Link to="/signpage" style={{ textDecoration: "none" }}>
        <Sign>Sign up</Sign>
      </Link>
      <Link to="/loginpage" style={{ textDecoration: "none" }}>
        <Login>Login</Login>
      </Link>
      <HamburgerMenuIcon onClick={handleMenuToggle} />
    </Container>
  );
}

export default Header;

const slideDown = keyframes`
  from {
    transform: translateY(-1px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-1px);
    opacity: 0;
  }
`;

const Container = styled.div`
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 자식들 사이에 공간을 균등하게 배분 */
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.5s,
    box-shadow 0.5s,
    backdrop-filter 0.5s;

  &.scrolled {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
  }
`;

const Logo = styled.img`
  width: 100px;
  cursor: pointer;
  margin-left: 60px;
`;

const Tabs = styled.div<{ $isClickMenuBtn: boolean; $animate: boolean }>`
  display: grid;
  grid-template-columns: repeat(
    4,
    1fr
  ); /* Tabs 내에 4개의 Tab을 동일한 너비로 분배 */
  width: 40%;
  justify-items: center;
  margin: 0 auto; /* Tabs를 가운데 정렬 */
`;

const Tab = styled.div`
  position: relative;

  & a {
    text-decoration: none;
    font-weight: 500;
    font-size: 1.15rem;
    color: black;
    transition: color 0.3s;
    padding: 15px 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    /* Tab 하단에 밑줄 애니메이션 설정 */
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%; /* Tab 전체 너비 */
      height: 3px;
      background: black;
      transform: scaleX(0); /* 초기 상태에서 밑줄이 보이지 않음 */
      transform-origin: bottom right; /* 오른쪽에서 왼쪽으로 확장 */
      transition: transform 0.3s ease; /* 부드러운 애니메이션 */
    }

    /* 호버 시 밑줄 애니메이션 */
    &:hover::before {
      transform: scaleX(1); /* 호버 시 밑줄이 왼쪽에서 오른쪽으로 확장 */
      transform-origin: bottom left;
    }
  }
`;

const Sign = styled.div`
  margin-right: 40px;
  cursor: pointer; /* 마우스 커서를 손가락 모양으로 변경 */
  font-weight: bold;
  color: black;
`;

const Login = styled.div`
  margin-right: 40px;
  padding: 10px 20px;
  background-color: black; /* 배경색을 검정으로 설정 */
  color: white; /* 글씨 색을 흰색으로 설정 */
  border-radius: 5px; /* 테두리를 살짝 둥글게 */
  font-weight: bold; /* 글씨를 굵게 설정 */
  cursor: pointer; /* 마우스 커서를 손가락 모양으로 변경 */
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 */

  &:hover {
    background-color: #333; /* 호버 시 조금 밝은 검정색으로 변경 */
  }
`;

const HamburgerMenuIcon = styled(RxHamburgerMenu)``;
