import React from "react";
import MainLogoImg from '../../assets/Mainlogo.png';
import './Header.css';
import { Link } from "react-router-dom";
import LoginBtn from "../../assets/box-arrow-in-right.svg";

function Header(): JSX.Element {
  return (
    <div className="header-container">
      <Link to="/">
        <img id="MainLogo" src={MainLogoImg} alt="Main Logo" />
      </Link>
      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/crewpage">크루</Link></li>
        <li className="navbar-item"><Link to="/mypage">마이페이지</Link></li>
        <li className="navbar-item"><Link to="/recodepage">운동 히스토리</Link></li>
        <li className="navbar-item"><Link to="/communitypage">운동 커뮤니티</Link></li>
        <li className="navbar-item"><Link to="/aboutpage">페이지 소개</Link></li>
      </ul>
      <Link to="/loginpage">
        <img id="LoginBtn" src={LoginBtn} alt="Login Btn" />
      </Link>
    </div>
  );
}

export default Header;
