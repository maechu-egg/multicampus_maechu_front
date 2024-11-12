import React, { useEffect, useState } from "react";
import './Modal.css';
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewSearchDivEdit from "../selectDiv/CrewSearchDivEdit";

interface CrewInfoProps {
    battle_id: number;
    crewId:number;
}   

function CrewBattleFeedModal({battle_id, crewId}:CrewInfoProps) {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;
    const [feed_img, setSelectedFile] = useState<File | null>(null);
    const [feed_post, setFeedContent] = useState('');
    const [kcalType, setKcalType] = useState('direct');
    const [feed_kcal, setFeedKcal] = useState(0);
    const [feed_exTime, setFeedExTime] = useState<number | string>(0); // 초기값을 숫자로 설정
    const [participantId, setParticipantId] = useState(0);
    const [crew_sport, setCrew_sport] = useState('');


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // 배틀에 참가중인 멤버 목록 조회 API
    useEffect( () => {
        const getBattleMember = async () => {
            try{
                const response = await api.get(`crew/battle/member/list?battle_id=${battle_id}&crew_id=${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> participantId", response.data);
                response.data.map((member: any) => {
                    if (member.member_id === member_id) {
                        setParticipantId(member.participant_id);
                    }
                });
            } catch (error) {
                console.log("debug >>> participantId error", error);
            }
        }
        getBattleMember();
    }, [battle_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            feed_img: feed_img ? feed_img : "이미지 없음",
            feed_post,
            feed_kcal,
            feed_exTime,
            crew_sport,
            battle_id,
            participant_id: participantId
        };
        console.log('Form Data:', data);
        // 피드 생성 API
        const createFeed = async() => {
            try{
                const response = await api.post(`crew/battle/feed/create`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> createFeed response", response.data);
                alert("피드 생성 완료");
            } catch (error) {
                console.log("debug >>> createFeed error", error);
            }
        }
        createFeed();
    };

    const setCrewSports = (crewSport: string) => {
        setCrew_sport(crewSport);
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 운동 사진 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>운동 사진</label>
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 피드 내용 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>피드 내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={feed_post}
                        onChange={(e) => setFeedContent(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 칼로리 입력 방식 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>칼로리 입력 방식</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100 " style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="direct"
                                name="postOption"
                                value="direct"
                                checked={kcalType === 'direct'}
                                onChange={(e) => setKcalType(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="direct">칼로리 직접 입력</label>

                            <input
                                type="radio"
                                id="indirect"
                                name="postOption"
                                value="indirect"
                                checked={kcalType === 'indirect'}
                                onChange={(e) => setKcalType(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="indirect">운동 종목으로 칼로리 계산</label>
                            <span className='glider2'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 칼로리 입력 */}
                {kcalType === 'direct' && (
                    <>
                        <div className="form-group form-control" style={{ width: '100%' }}>
                            <label>칼로리 입력</label>
                            <input
                                type="text"
                                className="form-control"
                                value={feed_kcal}
                                onChange={(e) => setFeedKcal(Number(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <br />
                    </>
                )}
                {/* 운동 종목 */}
                {kcalType === 'indirect' && (
                    <>
                        <div className='form-group form-control' style={{ width: '100%' }}>
                            <label>운동 종목</label>
                            <CrewSearchDivEdit onSearchSport={setCrewSports}/>
                            <br />
                            <h5>선택된 운동 종목 : {crew_sport}</h5>
                        </div>
                        <br />
                    </>
                )}
                {/* 운동 시간 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>운동 시간</label>
                    <input
                        type="text"
                        className="form-control"
                        value={feed_exTime === 0 ? '' : feed_exTime} // 입력 필드가 비어 있으면 빈 문자열을 표시
                        onChange={(e) => setFeedExTime(e.target.value === '' ? 0 : Number(e.target.value))} // 빈 값일 경우 0, 아니면 숫자
                        placeholder="분단위로 적어주세요 ex) 30, 60, 90"
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">피드 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewBattleFeedModal;
