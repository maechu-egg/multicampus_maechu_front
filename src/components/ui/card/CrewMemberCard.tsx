import React, { useEffect, useState } from "react";
import './Card.css';
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";
import { useNavigate } from "react-router-dom";

interface Member {
    member_id: number;
    nickname: string;
    profile_age: number;
    profile_region: string;
    battle_wins: number;
    crew_member_state: number;
    badge_level: string;
}

interface CrewInfoProps {
    member: Member;
    crewId: number;
}

function CrewMemberCard({ member, crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const memberId = state.memberId;
    const token = state.token;
    const navigate = useNavigate();
    const [imgPath, setImgPath] = useState<string>("");
    const [crewLeader, setCrewLeader] = useState<number>(0);

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
        } else if(member.badge_level=== null) {
            setImgPath("/img/crewBadge/CrewBadgeDefault.png");
        }
    }, [member]);

    useEffect(() => {
        const getCrewInfo = async() => {
            try {
                const response = await api.get(`crew/info/${crewId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("debug >>> getCrewInfo response", response.data);
                setCrewLeader(response.data.member_id);
            } catch (error) {
                console.log('Error getting crew info:', error);
            }
        }
        getCrewInfo();
    },[crewId])

    const acceptHandler = async() => {
        const data = {
            crew_id : crewId,
            member_id : member.member_id
        }
        try{
            const response = await api.patch(`crew/member/approve`,data ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("debug >>> acceptHandler response", response.data);
            alert("승인되었습니다.");
            navigate(`/`);
        } catch (error) {
            console.log('Error accepting crew member:', error);
        }
    }

    const rejectHandler = async() => {
        const data = {
            crew_id : crewId,
            member_id : member.member_id
        }   
        try{
            const response = await api.delete(`crew/member/delete`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: data
            });
            console.log("debug >>> rejectHandler response", response.data);
            alert("거절되었습니다.");
            navigate(`/`);
        } catch (error) {
            console.log('Error rejecting crew member:', error);
        }   
    }

    const exitHandler = async() => {
        const data = {
            crew_id : crewId,
            member_id : member.member_id
        }   
        try{
            const response = await api.delete(`crew/member/delete`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: data
            });
            console.log("debug >>> exitHandler response", response.data);
            alert("탈퇴 하였습니다.");
            navigate(`/`);
        } catch (error) {
            console.log('Error exitHandler crew member:', error);
        }  
    }

    const expulsionHandler = async() => {
        const data = {
            crew_id : crewId,
            member_id : member.member_id
        }   
        try{
            const response = await api.delete(`crew/member/delete`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: data
            });
            console.log("debug >>> expulsionHandler response", response.data);
            alert("탈퇴 되었습니다.");
            navigate(`/`);
        } catch (error) {
            console.log('Error expulsionHandler crew member:', error);
        }  
    }

    return (
        <div className="card border-dark" style={{ width: '18rem', borderRadius: '15px', borderWidth: '1px' }}>
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className="mb-3" style={{ width: '50%' }}>
                    <img 
                        src={`${imgPath}`}
                        alt={`${member.badge_level}`} 
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
                {member.crew_member_state === 0 && memberId == crewLeader && (
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
                {member.crew_member_state === 1 && member.member_id == memberId && (
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
                {member.crew_member_state === 1 && memberId == crewLeader && member.member_id != crewLeader && (
                    <button
                        className="btn btn-danger flex-fill exit-btn" 
                        onClick={expulsionHandler}
                    >
                        내보내기
                    </button>
                )}
            </div>
        </div>
    );
}

export default CrewMemberCard;
