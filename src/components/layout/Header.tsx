import React from "react";
import './Header.css';
import { Link } from "react-router-dom";

const MainLogo = process.env.PUBLIC_URL + '/img/Mainlogo.png';
const LoginIcon = process.env.PUBLIC_URL + '/img/box-arrow-in-right.svg';

function Header(): JSX.Element {
  return (
    <div className="header-container">
      <Link to="/">
        <img id="MainLogo" src={MainLogo} alt="Main Logo" />
        {/*<span className="workspace-text">workspace</span> */}
      </Link>
      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/crewpage">크루</Link></li>
        <li className="navbar-item"><Link to="/mypage">마이페이지</Link></li>
        <li className="navbar-item"><Link to="/recordpage">운동 히스토리</Link></li>
        <li className="navbar-item"><Link to="/communitypage">운동 커뮤니티</Link></li>
        <li className="navbar-item"><Link to="/aboutpage">페이지 소개</Link></li>
      </ul>
      <Link to="/loginpage">
        <img id="LoginBtn" src={LoginIcon} alt="Login Btn" />
      </Link>
    </div>
  );
}

export default Header;
