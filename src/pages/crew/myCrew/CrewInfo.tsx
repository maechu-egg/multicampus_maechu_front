import React from "react";

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
            크루 소개페이지
        </div>
    );
}

export default CrewInfo;