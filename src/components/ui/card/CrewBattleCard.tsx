import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";

interface Battle {
    battle_content: string;
    battle_end_date: string;
    battle_id: number;
    battle_end_recruitment: string;
    battle_goal: string;
    battle_name: string;
    crew_id: number;
}

interface CrewInfoProps {
    battle: Battle; // 개별 멤버 객체를 prop으로 받습니다.
    onDetailClick: () => void;
}

function CrewBattleCard({ battle, onDetailClick }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const getBattleMember = async () => {
            try {
                const response = await api.get(`crew/battle/member/list?battle_id=${battle.battle_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("debug >>> 내가 속했는지 보기위한 배틀참여멤버 조회 response", response.data);
                for(let i = 0; i < response.data.length; i++){
                    console.log("debug >>> ", memberId, response.data[i].member_id);
                    if(memberId == response.data[i].member_id){
                        setIsMember(true);
                        break;
                    } else {
                        setIsMember(false);
                    }
                }
            } catch (error) {
                console.log("debug >>> getBattleMember error", error);
            }
        }
        getBattleMember();
    }, [memberId]);

    const formattedBattleEndDate = new Date(battle.battle_end_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="card text-center mb-3" style={{ width: "20em", height: "100%", marginRight: "20px" }}>
            {/* props 받아서 온 데이터들 정리해서 보여주기 */}
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-start align-items-center">
                    <h3 className="card-title">{battle.battle_name}</h3>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="badge rounded-pill text-bg-primary">진행중</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                    <img src="/img/VS.png" className="card-img mx-1" style={{ width: "30%" }} />
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "18px" }}>신유민</p>
                    <p className="ms-3" style={{ fontSize: "18px" }}>강은종</p>
                </div>
                <div className="progress-stacked">
                    <div className="progress" role="progressbar" aria-label="Segment one" aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} style={{ width: '60%' }}>
                        <div className="progress-bar bg-primary" style={{height: "100%"}}></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                        <div className="progress-bar bg-danger" style={{height: "100%"}}></div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                    <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                </div>
                <div className="justify-content-center align-items-center">
                    <p>종료일 : {formattedBattleEndDate}</p>
                </div>
                <p className="card-text" style={{ fontSize: "15px" }}>{battle.battle_content}</p>
                <div className="mt-auto">
                    {isMember == true &&(
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleFeedDetailModal"
                            onClick={onDetailClick}
                        >
                            상세 보기
                        </button>
                    )}
                    {isMember == false &&(
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleJoinModal"
                            onClick={onDetailClick}
                        >
                            참가하기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrewBattleCard;
