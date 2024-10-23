import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewInfo({ crewId }: CrewInfoProps): JSX.Element {
    {/* 
        useEffect로 crewId에 맞는 정보 불러와서 crew_intro_img 왼쪽에 보여주고
        crew_name 오른쪽 윗부분, crew_intro_post 오른쪽 아래부분
    */}
    return (
        <div className="container">
            <br />
            <br />
            <br />
            <div className="row mt-3 d-flex justify-content-around align-items-center">
                <div className="col-md-8 col-12 d-flex justify-content-center">
                    <img
                        src="/img/person.png"
                        alt="크루 이미지"
                        className="img-fluid"
                        style={{marginRight: "0px"}}
                    />
                </div>
                <div className="col-md-8 col-12">
                    <div className="d-flex justify-content-center">
                        <h1>크루 이름</h1>
                    </div>
                    <p>
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                    </p>
                    <div className="d-flex justify-content-center">
                        <p>since</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <p>20xx.xx.xx</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewInfo;
