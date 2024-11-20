import React, { useEffect, useState } from "react";
import './Card.css';
import './MemberCard.css';
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";

interface Member {
    member_id: number;
    nickname: string;
    profile_age: number;
    profile_region: string;
    battle_wins: number;
    crew_member_state: number;
    badge_level: string;
    email : string;
    phone : string;
}

interface CrewInfoProps {
    member: Member;
    crewId: number;
    onClick: () => void;
}

function CrewMemberCardEdit({ member, crewId, onClick }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const memberId = state.memberId;
    const token = state.token;
    const [imgPath, setImgPath] = useState<string>("");
    const [crewLeader, setCrewLeader] = useState<number>(0);
    const [phoneNumber, setPhoneNumber] = useState('');

    // 전화번호 포맷팅 함수
    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, ''); // 숫자만 추출
        if (cleaned.length === 11) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
        }
        return phone;
    };

    // 핸드폰 번호 포맷 설정
    useEffect(() => {
        if (member.phone) {
            setPhoneNumber(formatPhoneNumber(member.phone));
        }
    }, [member.phone]);


    // 뱃지 레벨에 따른 이미지 세팅
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

    // 특정 크루의 정보 조회 API
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

    // 크루장만 가능한 가입 승인 버튼 활성화
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
            onClick();
        } catch (error) {
            console.log('Error accepting crew member:', error);
        }
    }

    // 크루장만 가능한 가입 거절 버튼 활성화
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
            onClick();
        } catch (error) {
            console.log('Error rejecting crew member:', error);
        }   
    }

    // 스스로 크루에서 나가는 버튼 활성화
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
            window.location.reload();
        } catch (error) {
            console.log('Error exitHandler crew member:', error);
        }  
    }

    // 크루장만 가능한 크루에서 탈퇴시키는 버튼 활성화
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
            onClick();
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
                                <i className="fa fa-phone"></i>: {phoneNumber}
                                <br />
                                <i className="fa fa-envelope"></i>: {member.email}
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
