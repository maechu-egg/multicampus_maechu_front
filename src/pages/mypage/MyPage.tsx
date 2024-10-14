import React from "react";
import Header from "../../components/layout/Header";
import NavBar from "../../components/layout/NavBar";

function MyPage():JSX.Element {
  return (
        <div>
            <div>
                <Header/> <NavBar/>
            </div>
            마이페이지입니다.
        </div>    
  );   
}

export default MyPage;  