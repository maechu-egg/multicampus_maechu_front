import { useEffect, useState } from "react";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewMemberCardEdit from "components/ui/crew/card/CrewMemberCardEdit";
interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewMemberInfo({ crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const [crewMembers, setCrewMembers] = useState<any[]>([]);

    //특정 크루에 가입된 크루원 목록 API
    const selectCrewMember = async () => {
        try {
            const response = await api.get(`crew/member/list/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("debug >>> 크루멤버정보 response", response.data);
            setCrewMembers(response.data);
        } catch (error) {
            console.log('Error selecting crew member:', error);
        }
    };

    useEffect(() => {
        selectCrewMember();
    }, []);
    
    return (
        <div className="container">
            <div className="row">
                {crewMembers.map(member => (
                    <div 
                        key={member.crew_member_id} 
                        className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center"
                    >
                        <CrewMemberCardEdit 
                            member={member} 
                            crewId={crewId} 
                            onClick={selectCrewMember}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrewMemberInfo;
