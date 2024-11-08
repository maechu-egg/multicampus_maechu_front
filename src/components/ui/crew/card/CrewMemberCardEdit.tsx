import React, { useEffect, useState } from "react";
import './Card.css';
import './MemberCard.css';
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

function CrewMemberCardEdit({ member, crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const memberId = state.memberId;
    const token = state.token;
    const navigate = useNavigate();
    const [imgPath, setImgPath] = useState<string>("");
    const [crewLeader, setCrewLeader] = useState<number>(0);

    useEffect(() => {
        if(member.badge_level === "브론즈") {
            setImgPath("/img/crewMemberBadge/CrewBadgeBronze.png");
        } else if(member.badge_level === "실버") {
            setImgPath("/img/crewMemberBadge/CrewBadgeSilver.png");
        } else if(member.badge_level === "골드") {
            setImgPath("/img/crewMemberBadge/CrewBadgeGold.png");
        } else if(member.badge_level === "플래티넘") {
            setImgPath("/img/crewMemberBadge/CrewBadgePlatinum.png");
        } else if(member.badge_level === "다이아") {
            setImgPath("/img/crewMemberBadge/CrewBadgeDiamond.png");
        } else if(member.badge_level === "기본") {
            setImgPath("/img/crewMemberBadge/CrewBadgeDefault.png");
        } else if(member.badge_level=== null) {
            setImgPath("/img/crewMemberBadge/CrewBadgeDefault.png");
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
                console.log("debug >>> 크루 정보 response", response.data);
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
            window.location.reload(); // 현재 페이지 리로딩
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
            window.location.reload(); // 현재 페이지 리로딩
        } catch (error) {
            console.log('Error expulsionHandler crew member:', error);
        }  
    }

    return (
        <div className="profile-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-member">
                            <div className="img1"><img src="/img/sky.jpg" alt=""/></div>
                            <div className="img2"><img src={imgPath} alt=""/></div>
                            <div className="main-text list-unstyled">
                                <h2>{member.nickname}</h2>
                                <li><strong>나이:</strong> {member.profile_age}</li>
                                <li><strong>배틀 승리:</strong> {member.battle_wins}</li>
                            </div>
                            <div className="socials">
                                <i className="fa fa-phone"></i>: 010-1234-5678
                                <br />
                                <i className="fa fa-envelope"></i>: rkddmswhd@naver.com
                            </div>
                            <div className="d-flex">
                                {member.crew_member_state === 0 && memberId == crewLeader && (
                                    <>
                                        <button 
                                        className="btn btn-primary flex-fill accept-btn " 
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewMemberCardEdit;
