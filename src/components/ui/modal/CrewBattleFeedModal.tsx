import React, { useEffect, useState } from "react";
import './Modal.css';
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";

interface CrewInfoProps {
    battle_id: number;
}

function CrewBattleFeedModal({battle_id}:CrewInfoProps) {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;
    const [feed_img, setSelectedFile] = useState<File | null>(null);
    const [feed_post, setFeedContent] = useState('');
    const [kcalType, setKcalType] = useState('direct');
    const [feed_kcal, setFeedKcal] = useState(0);
    const [feed_exTime, setFeedExTime] = useState<number | string>(0); // 초기값을 숫자로 설정
    const [feed_sport, setFeedSport] = useState('');
    const [participantId, setParticipantId] = useState(0);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };
    useEffect( () => {
        const getBattleMember = async () => {
            try{
                const response = await api.get(`crew/battle/member/list?battle_id=${battle_id}`, {
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
            feed_sport,
            battle_id,
            participant_id: participantId
        };
        console.log('Form Data:', data);
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
                        <div className="tabs form-check form-check-inline w-100">
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
                            <input 
                                className='form-control' 
                                type="text" 
                                list="list" 
                                id="sport" 
                                value={feed_sport} // 선택된 값 표시
                                onChange={(e) => setFeedSport(e.target.value)} // 값이 변경될 때 상태 업데이트
                                style={{ width: '100%' }}
                            />
                            <datalist id="list">
                                <option value="산악" />
                                <option value="달리기" />
                                <option value="걷기" />
                                <option value="자전거" />
                                <option value="헬스" />
                                <option value="배드민턴" />
                            </datalist>
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
