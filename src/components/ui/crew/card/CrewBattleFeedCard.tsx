import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext"; 
import api from "services/api/axios";

interface Member {
    member_id: number;
    nickname: string;
    feed_count: number;
    participant_id: number;
    profile_age: number;
    profile_region: string;
    total_feed_exTime: number;
    total_feed_kcal: number;
    badge_level: string;
}

interface CrewBattleFeedCardProps {
    member: Member;
    onClickHandler: () => void;
    battleId: number;
    crewId: number;
}

function CrewBattleFeedCard({ member, onClickHandler, battleId, crewId}: CrewBattleFeedCardProps) {
    const [imgPath, setImgPath] = useState<string>("");
    const { state } = useAuth();
    const memberId = state.memberId;
    const token = state.token;

    // 뱃지 레벨에 맞게 뱃지 이미시 세팅
    useEffect(() => {
        if(member.badge_level === "브론즈") {
            setImgPath("/img/crewBadge/CrewBadgeBronze.png");
        } else if(member.badge_level === "실버") {
            setImgPath("/img/crewBadge/CrewBadgeSilver.png");
        } else if(member.badge_level === "골드") {
            setImgPath("/img/crewBadge/CrewBadgeGold.png");
        } else if(member.badge_level === "플래티넘") {
            setImgPath("/img/crewBadge/CrewBadgePlatinum.png");
        } else if(member.badge_level === "다이아") {
            setImgPath("/img/crewBadge/CrewBadgeDiamond.png");
        } else if(member.badge_level === "기본") {
            setImgPath("/img/crewBadge/CrewBadgeDefault.png");
        } else if(member.badge_level === null){
            setImgPath("/img/crewBadge/CrewBadgeDefault.png");
        }
    }, [member]);

    // 투표 하기 API 
    const VoteHandler = async() => {
        const data = {
            battle_id: battleId,
            participant_id: member.participant_id,
            member_id: memberId
        }
        try{
            const response = await api.post(`crew/battle/vote/create?crew_id=${crewId}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("debug >>> VoteHandler response", response.data);
            alert("투표가 완료되었습니다.");
        } catch (error) {
            console.log("debug >>> VoteHandler error", error);
            alert("한 배틀에 여러번 투표할 수 없습니다.");
        }
    }

    return (
        <div className="container" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
                <div className="card border-dark" style={{ width: '100%', borderRadius: '15px', borderWidth: '1px' }}
                    onClick={onClickHandler}
                >
                    <div className="card-body d-flex justify-content-between align-items-center" style={{height: "110px", padding: "4px"}}>
                        <div style={{ width: '40%' }}>
                            <img 
                                src={`${imgPath}`}
                                alt="Badge" 
                                className="img-fluid"
                            />
                        </div>
                        <ul className="list-unstyled text-center" style={{ width: '60%', marginTop: "20px" }}>
                            <li style={{fontSize: "30px"}}>{member.nickname}</li>
                        </ul>
                    </div>
                    <div>
                        <ul className="list-unstyled text-end" style={{ width: '100%' }}>
                            <li style={{padding: 0}}><strong>피드</strong> : {member.feed_count}개</li>
                            <li style={{padding: 0}}><strong>누적 칼로리</strong>:{member.total_feed_kcal}kcal</li>
                            <li style={{padding: 0}}><strong>누적 운동시간</strong>:{member.total_feed_exTime}분</li>
                        </ul>
                    </div>
                    <div className="d-flex">
                        {/* 현재 로그인된 계정과 카드의 MEMBERID가 같을경우에만 피드추가 버튼 활성화 */}
                        {memberId == member.member_id && (
                            <button 
                                className=" flex-fill accept-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#battleFeedModal"
                            >
                                피드 추가
                            </button>
                        )}
                        {/* 내 카드에도 투표하기가 나오도록 같이 활성화 */}
                        {memberId == member.member_id && (
                            <button
                                className=" flex-fill reject-btn"
                                onClick={VoteHandler}
                            >
                                투표 하기
                            </button>
                        )}
                        {/* 로그인 계정과 카드의 MEMBERID가 다를경우에는 투표하기 버튼만 활성화 */}
                        {memberId != member.member_id && (
                            <button
                                className="btn btn-danger flex-fill exit-btn"
                                onClick={VoteHandler}
                            >
                                투표 하기
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CrewBattleFeedCard;
