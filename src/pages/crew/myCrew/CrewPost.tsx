import React from "react";

interface CrewPostProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewPost({ crewId }:CrewPostProps): JSX.Element {
    {/* useEffect로 crewId에 맞게 정보가져옴 커뮤니티쪽 재활용 가능 */}
    return (
        <div className="container">
            크루 게시판 페이지
        </div>
    );
}

export default CrewPost;