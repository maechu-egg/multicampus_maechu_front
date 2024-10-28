import React from "react";
import CrewBattleFeedModal from "../modal/CrewBattleFeedModal";

interface Member {
    member_id: number;
    nickname: string;
    feed_count: number;
    participant_id: number;
    profile_age: number;
    profile_region: string;
    total_feed_exTime: number;
    total_feed_kcal: number;
}

interface CrewBattleFeedCardProps {
    member: Member;
    onClickHandler: () => void;
}

function CrewBattleFeedCard({ member, onClickHandler}: CrewBattleFeedCardProps) {


    return (
        <div className="container">
            <br />
            <div className="d-flex justify-content-center align-items-center">
                <div className="card border-dark" style={{ width: '90%', borderRadius: '15px', borderWidth: '1px' }}
                    onClick={onClickHandler}
                >
                    <div className="card-body d-flex justify-content-between align-items-center" style={{height: "110px", padding: "4px"}}>
                        <div style={{ width: '50%', height: '100%' }}>
                            <img 
                                src="/img/bronze.jpg" 
                                alt="Badge" 
                                className="img-fluid"
                            />
                        </div>
                        <ul className="list-unstyled text-center" style={{ width: '50%' }}>
                            {/* 가지고온 정보를 보여줌. */}
                            <li><strong>{member.nickname}</strong></li>
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
