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
    battle_state: number;
}

interface CrewInfoProps {
    battle: Battle; // 개별 멤버 객체를 prop으로 받습니다.
    onDetailClick: () => void;
    crewId: number;
}

function CrewBattleCard({ battle, onDetailClick, crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;
    const [isMember, setIsMember] = useState(false);
    const [firstScoreMember, setFirstScoreMember] = useState<{ nickname: string, vote_count: number } | null>(null);
    const [secondScoreMember, setSecondScoreMember] = useState<{ nickname: string, vote_count: number } | null>(null);
    const [firstPercent, setFirstPercent] = useState<number>(0);
    const [secondPercent, setSecondPercent] = useState<number>(0);


    useEffect(() => {
        //변경 가능한 변수로 투표수 선언
        let firstScoreMemberVote = firstScoreMember?.vote_count || 0;
        let secondScoreMemberVote = secondScoreMember?.vote_count || 0;

        // 평균을 내기위한 투표수 총합
        const totalVote = firstScoreMemberVote + secondScoreMemberVote;

        // 받은 투표수를 백분율로 변경
        const firstPercentValue = Math.round((firstScoreMemberVote / totalVote) * 100);
        const secondPercentValue = Math.round((secondScoreMemberVote / totalVote) * 100);

        setFirstPercent(firstPercentValue);
        setSecondPercent(secondPercentValue);

    }, [firstScoreMember, secondScoreMember]);
    
    // 배틀 참가 멤버 조회 API를 사용하여 가장 투표를 많이 받은 TOP2명의 정보 불러오기 & 내가 배틀에 속해있는지 확인하기 위함
    useEffect(() => {
        const getBattleMember = async () => {
            try {
                const response = await api.get(`crew/battle/member/list?battle_id=${battle.battle_id}&crew_id=${crewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log("debug >>> 내가 속했는지 보기위한 배틀참여멤버 조회 response", response.data);
                setFirstScoreMember(response.data[0]);
                setSecondScoreMember(response.data[1]);
                
                for(let i = 0; i < response.data.length; i++){
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
    }, [battle.battle_id]);

    // 날짜 포멧 변경
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
                    {battle.battle_state == 0 &&(
                        <span className="badge rounded-pill text-bg-danger">모집중</span>
                    )}
                    {battle.battle_state == 1 &&(
                        <span className="badge rounded-pill text-bg-secondary">진행중</span>
                    )}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                    <img src="/img/VS.png" className="card-img mx-1" style={{ width: "30%" }} />
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "18px" }}>{firstScoreMember?.nickname}</p>
                    <p className="ms-3" style={{ fontSize: "18px" }}>{secondScoreMember?.nickname}</p>
                </div>
                <div className="progress-stacked">
                    <div className="progress" role="progressbar" aria-label="Segment one" aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} style={{ width: `${firstPercent}%` }}>
                        <div className="progress-bar bg-primary" style={{height: "100%"}}></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: `${secondPercent}%` }}>
                        <div className="progress-bar bg-danger" style={{height: "100%"}}></div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "15px" }}>{firstPercent}%</p>
                    <p className="ms-3" style={{ fontSize: "15px" }}>{secondPercent}%</p>
                </div>
                <div className="justify-content-center align-items-center">
                    <p>종료일 : {formattedBattleEndDate}</p>
                </div>
                <p className="card-text" style={{ fontSize: "15px" }}>{battle.battle_content}</p>
                <div className="mt-auto">
                    {/* 배틀에 참가중이면서 배틀이 시작되었을 때는 상세보기 버튼 활성화 */}
                    {isMember == true && battle.battle_state == 1 && (
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleFeedDetailModal"
                            onClick={onDetailClick}
                        >
                            상세 보기
                        </button>
                    )}
                    {/* 배틀에 참가중이지만 아직 모집중일 때는 상세보기 버튼 비활성화 */}
                    {isMember == true && battle.battle_state == 0 && (
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleFeedDetailModal"
                            onClick={onDetailClick}
                            disabled={true}
                        >
                            상세보기
                        </button>
                    )}
                    {/* 배틀에 참가하지 않았으면서 모집중일 때는 참가하기 버튼 활성화 */}
                    {isMember == false && battle.battle_state == 0 && (
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleJoinModal"
                            onClick={onDetailClick}
                        >
                            참가하기
                        </button>
                    )}
                    {/* 배틀에 참가중이지 않지만 배틀이 시작하면 피드보기로 버튼 활성화 */}
                    {isMember == false && battle.battle_state == 1 && (
                        <button 
                            className="btn btn-secondary" 
                            data-bs-toggle="modal"
                            data-bs-target="#battleFeedDetailModal"
                            onClick={onDetailClick}
                        >
                            피드 보기
                        </button>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default CrewBattleCard;
