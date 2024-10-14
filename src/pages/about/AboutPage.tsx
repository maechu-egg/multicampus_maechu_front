import React from "react";
import Header from "../../components/layout/Header";
import NavBar from "../../components/layout/NavBar";

function AboutPage(): JSX.Element {
    return (
        <div>
            <div>
                <Header/> <NavBar/>
            </div>
            소개 페이지입니다.
        </div>
  );   
}

export default AboutPage;