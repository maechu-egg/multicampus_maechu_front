// NavBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import ListTaskSvg from '../../assets/list-task.svg';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar-custom">
      <img id="ListTask" src={ListTaskSvg} alt="List Task" className="navbar-logo" />
      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/crewpage">크루</Link></li>
        <li className="navbar-item"><Link to="/mypage">마이페이지</Link></li>
        <li className="navbar-item"><Link to="/recodepage">운동 히스토리</Link></li>
        <li className="navbar-item"><Link to="/communitypage">운동 커뮤니티</Link></li>
        <li className="navbar-item"><Link to="/aboutpage">페이지 소개</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
