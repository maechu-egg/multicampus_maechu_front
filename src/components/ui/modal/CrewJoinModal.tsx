import React, { useEffect, useState } from 'react';
import './Modal.css';
import { useAuth } from "context/AuthContext";
import { useNavigate } from 'react-router-dom';
import api from 'services/api/axios';

function CrewJoinModal({ crew_id }: { crew_id: number}) {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;
    const navigate = useNavigate();
    // 입력 필드 상태 관리
    const [crew_name, setCrew_name] = useState('');
    const [crew_title, setCrew_title] = useState('');
    const [crew_location, setCrew_location] = useState('');
    const [crew_sport, setCrew_sport] = useState('');
    const [age, setAge] = useState('');

    // 라디오 버튼 상태 관리
    const [crew_goal, setCrew_goal] = useState('다이어트');
    const [crew_gender, setCrew_gender] = useState('남성');
    const [crew_frequency, setCrew_frequency] = useState('주 1~3회');
    const [crew_state, setCrew_state] = useState(0);

    // 크루에 속한 멤버인지 판별
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const getCrewInfo = async() => {
            try{
                const response = await api.get(`crew/info/${crew_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> 크루수정 모달 response", response.data);
                setCrew_name(response.data.crew_name);
                setCrew_title(response.data.crew_title);
                setCrew_location(response.data.crew_location);
                setCrew_sport(response.data.crew_sport);
                setCrew_goal(response.data.crew_goal);
                setCrew_gender(response.data.crew_gender);
                setCrew_frequency(response.data.crew_frequency);
                setCrew_state(response.data.crew_state);
                setAge(response.data.crew_age);
            } catch (error) {
                console.log('Error getting crew info:', error);
            }
        };

        const getCrewMemberInfo = async() => {
            try {
                const response = await api.get(`crew/member/list/${crew_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                for(let i=0; i<response.data.length; i++) {
                    if(member_id === response.data[i].member_id){
                        setIsMember(true);
                        break;
                    } else {
                        setIsMember(false);
                    }
                }
            } catch(error) {
                console.log('Error getting crewMember info', error)
            }
        }
        getCrewInfo();
        getCrewMemberInfo();
    },[crew_id]);

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            crew_id,
            member_id
        };
        console.log("debug >>> data", data);

        const insertCrew = async() => {
            try {
                const response = await api.post(`crew/member/add`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> createCrew response", response);
                alert("크루 가입 신청이 완료되었습니다.");
                navigate("/");
            } catch (error) {
                console.error('Error creating crew:', error);
                alert("크루 가입 신청에 실패 했습니다.");
            }
        };
        insertCrew();
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} >
                {/* 크루 이름 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>크루 이름</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_name}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 크루 목표 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>크루 목표</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="radio-1"
                                name="goal"
                                value="다이어트"
                                checked={crew_goal === '다이어트'}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-1">다이어트</label>

                            <input
                                type="radio"
                                id="radio-2"
                                name="goal"
                                value="벌크업"
                                checked={crew_goal === '벌크업'}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-2">벌크업</label>

                            <input
                                type="radio"
                                id="radio-3"
                                name="goal"
                                value="린매스업"
                                checked={crew_goal === '린매스업'}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-3">린매스업</label>
                            <input
                                type="radio"
                                id="radio-4"
                                name="goal"
                                value="유지"
                                checked={crew_goal === '유지'}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-4">유지</label>
                            <span className='glider3'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 활동 지역 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>활동 지역</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_location}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 운동 종목 */}
                <div className='form-group form-control' style={{ width: '100%' }}>
                    <label>운동 종목</label>
                    <input 
                        className='form-control' 
                        type="text" 
                        list="list" 
                        id="sport" 
                        value={crew_sport} // 선택된 값 표시
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
                {/* 선호 성별 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>선호 성별</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="남성"
                                checked={crew_gender === '남성'}
                            />
                            <label className="tab w-100 text-center" htmlFor="male">남성</label>

                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="여성"
                                checked={crew_gender === '여성'}
                            />
                            <label className="tab w-100 text-center" htmlFor="female">여성</label>

                            <input
                                type="radio"
                                id="all"
                                name="gender"
                                value="혼성"
                                checked={crew_gender === '혼성'}
                            />
                            <label className="tab w-100 text-center" htmlFor="all">혼성</label>
                            <span className='glider'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 활동 빈도 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>활동 빈도</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="small"
                                name="frequency"
                                value="주 1~3회"
                                checked={crew_frequency === '주 1~3회'}
                            />
                            <label className="tab w-100 text-center" htmlFor="small">주 1~3회</label>

                            <input
                                type="radio"
                                id="middle"
                                name="frequency"
                                value="주 3~5회"
                                checked={crew_frequency === '주 3~5회'}
                            />
                            <label className="tab w-100 text-center" htmlFor="middle">주 3~5회</label>

                            <input
                                type="radio"
                                id="big"
                                name="frequency"
                                value="주 5~7회"
                                checked={crew_frequency === '주 5~7회'}
                            />
                            <label className="tab w-100 text-center" htmlFor="big">주 5~7회</label>
                            <span className='glider'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 선호 나이 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>선호 나이</label>
                    <input
                        type="text"
                        className="form-control"
                        value={age}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 제목 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_title}
                        style={{ width: '100%' }}
                    />
                </div>
                <br/>
                {/* 게시글 여부 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>게시글 여부</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="yes"
                                name="postOption"
                                value={1}
                                checked={crew_state === 1}
                            />
                            <label className="tab w-100 text-center" htmlFor="yes">게시글 게시</label>

                            <input
                                type="radio"
                                id="no"
                                name="postOption"
                                value={0}
                                checked={crew_state === 0}
                            />
                            <label className="tab w-100 text-center" htmlFor="no">게시글 게시 안함</label>
                            <span className='glider2'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        data-bs-dismiss="modal" 
                        aria-label="Close"
                        disabled={isMember}
                    >
                        크루 가입 신청
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button 
                        type="button" 
                        className="btn btn-danger" 
                        data-bs-dismiss="modal" 
                        aria-label="Close"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrewJoinModal;
