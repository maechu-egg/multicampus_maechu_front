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
      <Link to="/loginpage">
        <img id="LoginBtn" src={LoginBtn} alt="Login Btn" />
      </Link>
    </div>
  );
}

export default Header;
