import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext"; // useAuth import

const MainLogo = process.env.PUBLIC_URL + "/img/Mainlogo.png";

function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false);
  const HeaderRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = useAuth(); // AuthContext에서 state와 dispatch 가져오기

  const handleCloseMenu = () => {
    setIsClickMenuBtn(false);
  };

  const handleNavigate = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsClickMenuBtn(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeaderRef.current &&
        !HeaderRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [HeaderRef]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsClickMenuBtn(!isClickMenuBtn);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("memberId");
    dispatch({ type: "LOGOUT" }); // 로그아웃 액션 실행
  };

  return (
    <Container ref={HeaderRef} className={isScrolled ? "scrolled" : ""}>
      <HamburgerMenuIcon onClick={toggleMenu} className="hamburger-menu" />
      <Link to="/">
        <Logo src={MainLogo} alt="Main Logo" />
      </Link>
      <Tabs>
        <Tab>
          <Link to="/communitypage" onClick={handleNavigate}>
            커뮤니티
          </Link>
        </Tab>
        <Tab>
          <Link to="/crewpage" onClick={handleNavigate}>
            운동 크루
          </Link>
        </Tab>
        <Tab>
          <Link to="/aboutpage" onClick={handleNavigate}>
            워크스페이스
          </Link>
        </Tab>
        <Tab>
          <Link to="/recodepage" onClick={handleNavigate}>
            나의 기록
          </Link>
        </Tab>
      </Tabs>

      <AuthButtons>
        {state.token ? (
          <>
            <Link to="/mypage" style={{ textDecoration: "none" }}>
              <Sign>My Page</Sign>
            </Link>
            <Login onClick={handleLogout}>Logout</Login>
          </>
        ) : (
          <>
            <Link to="/signpage" style={{ textDecoration: "none" }}>
              <Sign>Sign up</Sign>
            </Link>
            <Link to="/loginpage" style={{ textDecoration: "none" }}>
              <Login>Login</Login>
            </Link>
          </>
        )}
      </AuthButtons>

      {/* Sidebar for mobile */}
      <Sidebar $isClickMenuBtn={isClickMenuBtn}>
        <CloseIcon onClick={handleCloseMenu} />
        <SidebarContent>
          <Tab onClick={toggleMenu}>
            <Link to="/communitypage">커뮤니티</Link>
          </Tab>
          <Tab onClick={toggleMenu}>
            <Link to="/crewpage">운동 크루</Link>
          </Tab>
          <Tab onClick={toggleMenu}>
            <Link to="/aboutpage">워크스페이스</Link>
          </Tab>
          <Tab onClick={toggleMenu}>
            <Link to="/recodepage">나의 기록</Link>
          </Tab>
        </SidebarContent>
      </Sidebar>
    </Container>
  );
}

export default Header;

// Styled components
const Container = styled.div`
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 45%;
  justify-items: center;
  margin: 0 auto;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Tab = styled.div`
  position: relative;

  & a {
    text-decoration: none;
    font-weight: 500;
    font-size: 1.15rem;
    color: black;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 900px) {
    margin-right: 20px;
  }
`;

const Sign = styled.div`
  font-weight: bold;
  color: black;
`;

const Login = styled.div`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const HamburgerMenuIcon = styled(RxHamburgerMenu)`
  display: none;
  cursor: pointer;
  margin-left: 30px;
  font-size: 2rem;

  @media (max-width: 900px) {
    display: block;
  }
`;

const Sidebar = styled.div<{ $isClickMenuBtn: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 15;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${(props) => (props.$isClickMenuBtn ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  @media (min-width: 901px) {
    display: none;
  }
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 1.5rem;
`;

const SidebarContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
