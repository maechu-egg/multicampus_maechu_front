import React from "react";
import Header from "../../components/layout/Header";
import NavBar from "../../components/layout/NavBar";

function LoginPage():JSX.Element {
  return (
    <div>
        <div>
            <Header/> <NavBar/>
        </div>
        로그인 페이지입니다.
    </div>
    );
}

export default LoginPage;  