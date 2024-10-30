import React, { useEffect, useState } from "react";

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
}

function CrewBattleFeedCard({ member, onClickHandler, battleId}: CrewBattleFeedCardProps) {
    const [imgPath, setImgPath] = useState<string>("");

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
        }
    }, [member]);

    return (
        <div className="container" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
                <div className="card border-dark" style={{ width: '100%', borderRadius: '15px', borderWidth: '1px' }}
                    onClick={onClickHandler}
                >
                    <div className="card-body d-flex justify-content-between align-items-center" style={{height: "110px", padding: "4px"}}>
                        <div style={{ width: '50%' }}>
                            <img 
                                src={`${imgPath}`}
                                alt="Badge" 
                                className="img-fluid"
                            />
                        </div>
                        <ul className="list-unstyled text-center" style={{ width: '50%', marginTop: "20px" }}>
                            <li style={{fontSize: "30px"}}>{member.nickname}</li>
                        </ul>
                    </div>
                    <div>
                        <ul className="list-unstyled text-end" style={{ width: '100%' }}>
                            <li><strong>피드</strong> : {member.feed_count}개</li>
                            <li><strong>누적 칼로리</strong>:{member.total_feed_kcal}kcal</li>
                            <li><strong>누적 운동시간</strong>:{member.total_feed_exTime}분</li>
                        </ul>
                    </div>
                    <div className="d-flex">
                        <button 
                            className="btn btn-primary flex-fill accept-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#battleFeedModal"
                        >
                            피드 추가
                        </button>
                        <button
                            className="btn btn-danger flex-fill reject-btn" 
                        >
                            투표 하기
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CrewBattleFeedCard;
