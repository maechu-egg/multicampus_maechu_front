import React from "react";
import CrewMemberCard from "components/ui/card/CrewMemberCard";

const crewMembers = [
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },
    { id: 1, name: "신유민", age: 11, region: "익산", records: 5, wins: 1, crewWins: 1 },

    // 추가 멤버 데이터를 여기에 추가
];

function CrewMemberInfo(): JSX.Element {
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
            <div className="row">
                {crewMembers.map(member => (
                    <div key={member.id} className="col-md-4 mb-4 d-flex justify-content-center">
                        <CrewMemberCard />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrewMemberInfo;
