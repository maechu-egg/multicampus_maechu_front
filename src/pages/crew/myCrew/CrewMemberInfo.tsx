import React from "react";

interface CrewMemberProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewMemberInfo({ crewId }: CrewMemberProps): JSX.Element {
    {/* 
        useEffect를 사용해서 crewId에 맞는 정보 불러오고
        뱃지, 닉네임, 나이, 지역, 배틀 승리 횟수, 주간 운동 횟수 보여주기 (카드형식)
        뱃지가 왼쪽 나머지는 오른쪽에 정렬
        카드 footer부분은 crew_member_state가 1이면 내보내기/나가기 버튼활성화
                         crew_member_state가 0이면 승인 버튼 거절버튼 활성화
        승인 누르면 crew_member_state 1로 변경
        거절 누르면 테이블에서 삭제
        
    */}
    return (
        <div className="container">
            크루원 정보 페이지
        </div>
    );
}

export default CrewMemberInfo;