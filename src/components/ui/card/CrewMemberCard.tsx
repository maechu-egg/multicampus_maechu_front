import React from "react";
import './Card.css';

interface Member {
    member_id: number;
    nickname: string;
    profile_age: number;
    profile_region: string;
    battle_wins: number;
    crew_member_state: number;
}

interface CrewInfoProps {
    member: Member;
}

function CrewMemberCard({ member }: CrewInfoProps): JSX.Element {

    const acceptHandler = () => {
        console.log("승인 버튼 클릭");
    }

    const rejectHandler = () => {
        console.log("거절 버튼 클릭");
    }

    const exitHandler = () => {
        console.log("내보내기 / 나가기 버튼 클릭");
    }

    return (
        <div className="card border-dark" style={{ width: '18rem', borderRadius: '15px', borderWidth: '1px' }}>
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className="mb-3" style={{ width: '50%' }}>
                    <img 
                        src="/img/bronze.jpg" 
                        alt="Badge" 
                        className="img-fluid"
                    />
                </div>
                <ul className="list-unstyled text-center" style={{ width: '50%' }}>
                    {/* 가지고온 정보를 보여줌. */}
                    <li><strong>{member.nickname}</strong></li>
                    <li><strong>나이:</strong> {member.profile_age}</li>
                    <li><strong>지역:</strong> {member.profile_region}</li>
                    <li><strong>배틀 승리:</strong> {member.battle_wins} 회</li>
                </ul>
            </div>
            <div className="d-flex">
                {member.crew_member_state === 0 && (
                    <>
                        <button 
                        className="btn btn-primary flex-fill accept-btn" 
                            onClick={acceptHandler}
                        >
                            승인
                        </button>
                        <button
                            className="btn btn-danger flex-fill reject-btn" 
                            onClick={rejectHandler}
                        >
                            거절
                        </button>
                    </> 
                )}
                {/* 멤버상태가 1이면서, 로그인된 계정과 같은 member_id를 가지고 있는 카드만 버튼 활성화 */}
                {member.crew_member_state === 1 &&(
                    <>
                        <button
                            className="btn btn-danger flex-fill exit-btn" 
                            onClick={exitHandler}
                        >
                            나가기
                        </button>
                    </>
                )}
                {/* 크루장에게는 모든 카드에 내보내기 보이기 */}
            </div>
        </div>
    );
}

export default CrewMemberCard;
