import React from "react";
import Header from "../../components/layout/Header";
import NavBar from "../../components/layout/NavBar";

function HomePage(): JSX.Element {
  return (
    <div>
        <div>
          <Header/> <NavBar/>
        </div>
        홈페이지입니다.
    </div>
  );
}

export default HomePage;  