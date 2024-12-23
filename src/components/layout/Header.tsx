import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

const MainLogo = process.env.PUBLIC_URL + "/img/Mainlogo.png";

function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClickMenuBtn, setIsClickMenuBtn] = useState(false);
  const HeaderRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

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
    dispatch({ type: "LOGOUT" });
    navigate("/");
       window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 상태 변경 시 로그 출력
  useEffect(() => {
    console.log("현재 토큰:", state.token); // 현재 토큰 출력
  }, [state.token]);

  return (
    <Container ref={HeaderRef} className={isScrolled ? "scrolled" : ""}>
      <HamburgerMenuIcon onClick={toggleMenu} className="hamburger-menu" />
      <Link to="/">
        <Logo src={MainLogo} alt="Main Logo" onClick={handleNavigate}/>
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
          <Link to="/recordpage" onClick={handleNavigate}>
            나의 기록
          </Link>
        </Tab>
      </Tabs>

      <AuthButtons>
        {state.token ? (
          <>
            <Link to="/mypage" style={{ textDecoration: "none" }} >
              <Sign  onClick={handleNavigate}>My Page</Sign>
            </Link>
            <Login onClick={handleLogout}>Logout</Login>
          </>
        ) : (
          <>
            <Link to="/signpage" style={{ textDecoration: "none" }}  onClick={handleNavigate}>
              <Sign>Sign up</Sign>
            </Link>
            <Link to="/loginpage" style={{ textDecoration: "none" }}  onClick={handleNavigate}>
              <Login>Login</Login>
            </Link>
          </>
        )}
      </AuthButtons>

      {/* Sidebar for mobile */}
      <Sidebar $isClickMenuBtn={isClickMenuBtn}>
        <CloseIcon onClick={handleCloseMenu} />
        <SidebarContent>
          <Tab onClick={()=>{toggleMenu(); handleNavigate(); }}>
            <Link to="/communitypage">커뮤니티</Link>
          </Tab>
          <Tab onClick={()=>{toggleMenu(); handleNavigate(); }}>
            <Link to="/crewpage">운동 크루</Link>
          </Tab>
          <Tab onClick={()=>{toggleMenu(); handleNavigate(); }}>
            <Link to="/aboutpage">워크스페이스</Link>
          </Tab>
          <Tab onClick={()=>{toggleMenu(); handleNavigate(); }}>
            <Link to="/recordpage">나의 기록</Link>
          </Tab>
        </SidebarContent>
      </Sidebar>
    </Container>
  );
}

const MenuLinks = ({ handleNavigate }: { handleNavigate: () => void }) => (
  <>
    <Tab onClick={handleNavigate}>
      <Link to="/communitypage">커뮤니티</Link>
    </Tab>
    <Tab onClick={handleNavigate}>
      <Link to="/crewpage">운동 크루</Link>
    </Tab>
    <Tab onClick={handleNavigate}>
      <Link to="/aboutpage">워크스페이스</Link>
    </Tab>
    <Tab onClick={handleNavigate}>
      <Link to="/recordpage">나의 기록</Link>
    </Tab>
  </>
);

export default Header;

const Container = styled.div`
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: white;
  padding: 15px 10px;
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

  @media (max-width: 500px) {
    padding: 10px 0;
    z-index: 5;
  }
`;
const Logo = styled.img`
  width: 90px;
  cursor: pointer;
  margin-left: 20px;

  @media (min-width: 501px) and (max-width: 900px) {
    width: calc(70px + (90 - 70) * ((100vw - 500px) / 400));
    margin-left: calc(10px + (20 - 10) * ((100vw - 500px) / 400));
  }

  @media (min-width: 300px) and (max-width: 500px) {
    width: calc(50px + (70 - 50) * ((100vw - 300px) / 200));
    margin-left: calc(5px + (10 - 5) * ((100vw - 300px) / 200));
  }

  @media (max-width: 300px) {
    width: 50px;
    margin-left: 5px;
  }
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
    font-weight: 600;
    font-size: 1.25rem;
    color: black;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 114px; // 최소 너비 설정

   @media (min-width: 901px) and (max-width: 1033px) {
      font-size: calc(0.9rem + 0.3vw); // 901px에서 1033px 사이에서 크기 조정
    }
  }

  @media (max-width: 500px) {
    & a {
      font-size: 1rem;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 0;

  @media (min-width: 501px) and (max-width: 900px) {
    gap: calc(10px + (15px - 10px) * ((100vw - 500px) / 400));
    margin-right: calc(10px * ((100vw - 500px) / 400));
  }

  @media (min-width: 300px) and (max-width: 500px) {
    gap: calc(5px + (10px - 5px) * ((100vw - 300px) / 200));
    margin-right: calc(5px * ((100vw - 300px) / 200));
  }

  @media (max-width: 300px) {
    gap: 5px;
    margin-right: 0;
  }
`;

const Sign = styled.div`
  font-weight: bold;
  color: black;

  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
`;

const Login = styled.div`
  padding: 8px 16px;
  background-color: black;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #333;
  }

  @media (max-width: 500px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
`;


const HamburgerMenuIcon = styled(RxHamburgerMenu)`
  display: none;
  cursor: pointer;
  margin-left: 15px;
  font-size: 1.5rem;

  @media (max-width: 900px) {
    display: block;
  }

  @media (max-width: 500px) {
    font-size: 1.2rem;
  }
`;

const Sidebar = styled.div<{ $isClickMenuBtn: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 15;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${(props) => (props.$isClickMenuBtn ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  @media (max-width: 500px) {
    width: 180px;
  }

  @media (min-width: 901px) {
    display: none;
  }
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.3rem;

  @media (max-width: 500px) {
    font-size: 1.1rem;
  }
`;

const SidebarContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 500px) {
    padding: 10px;
    gap: 10px;
  }
`;
