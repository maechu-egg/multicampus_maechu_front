import React, { useEffect, useState } from "react";
import CrewMemberCard from "components/ui/card/CrewMemberCard";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewMemberInfo({ crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const [crewMembers, setCrewMembers] = useState<any[]>([]);

    useEffect(() => {
        const selectCrewMember = async () => {
            try {
                const response = await api.get(`http://localhost:8001/crew/member/list/${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> selectCrewMember response", response.data);
                setCrewMembers(response.data);
            } catch (error) {
                console.log('Error selecting crew member:', error);
            }
        };
        selectCrewMember();
    }, []);
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
                    <div key={member.crew_member_id} className="col-md-4 mb-4 d-flex justify-content-center">
                        <CrewMemberCard member={member} crewId={crewId}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrewMemberInfo;
