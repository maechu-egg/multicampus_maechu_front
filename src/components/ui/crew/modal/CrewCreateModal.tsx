import React, { useEffect, useState } from 'react';
import './Modal.css';
import { useAuth } from "context/AuthContext";
import { useNavigate } from 'react-router-dom';
import CrewSearchDivEdit from '../selectDiv/CrewSearchDivEdit';
import CrewLocationDiv from '../selectDiv/CrewLocationDiv';
import api from 'services/api/axios';

function CrewCreateModal() {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;
    const navigate = useNavigate();
    // 입력 필드 상태 관리
    const [crew_name, setCrew_name] = useState('');
    const [crew_title, setCrew_title] = useState('');
    const [crew_location, setCrew_location] = useState('');
    const [crew_sport, setCrew_sport] = useState('');

    // 라디오 버튼 상태 관리
    const [crew_goal, setCrew_goal] = useState('다이어트');
    const [crew_gender, setCrew_gender] = useState('남성');
    const [crew_frequency, setCrew_frequency] = useState('주 1~3회');
    const [crew_state, setCrew_state] = useState(0);

    // 체크박스 상태 관리 (선호 나이)
    const [crew_age, setCrew_age] = useState<string[]>([]);

    // 체크박스 선택 핸들러
    const handleAgeSelection = (age: string) => {
        if (crew_age.includes(age)) {
            setCrew_age(crew_age.filter((item) => item !== age));
        } else {
            setCrew_age([...crew_age, age]);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedAges = crew_age.join(', ');
        const data = {
            crew_name,
            crew_title,
            crew_location,
            crew_goal,
            crew_gender,
            crew_frequency,
            crew_state,
            crew_age: selectedAges,
            crew_sport,
            member_id,
        };
        console.log("debug >>> data", data);

        const createCrew = async() => {
            try {
                const response = await api.post(`crew/create`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> createCrew response", response);
                alert("크루 생성이 완료되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error('Error creating crew:', error);
                alert("크루 생성에 실패 했습니다.");
            }
        };
        createCrew();
    };

    const setCrewSports = (crewSport: string) => {
        setCrew_sport(crewSport);
    }

    const setLocation = (crewLocation: string, crewLocationDetail : string) => {
        setCrew_location(`${crewLocation}, ${crewLocationDetail}`);
    }

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
                        onChange={(e) => setCrew_name(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 크루 목표 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>크루 목표</label>
                    <div className="container d-flex justify-content-between w-100" >
                        <div className="d-flex tabs w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="radio-1"
                                name="goal"
                                value="다이어트"
                                checked={crew_goal === '다이어트'}
                                onChange={(e) => setCrew_goal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-1">다이어트</label>

                            <input
                                type="radio"
                                id="radio-2"
                                name="goal"
                                value="벌크업"
                                checked={crew_goal === '벌크업'}
                                onChange={(e) => setCrew_goal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-2">벌크업</label>

                            <input
                                type="radio"
                                id="radio-3"
                                name="goal"
                                value="린매스업"
                                checked={crew_goal === '린매스업'}
                                onChange={(e) => setCrew_goal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-3">린매스업</label>
                            <input
                                type="radio"
                                id="radio-4"
                                name="goal"
                                value="유지"
                                checked={crew_goal === '유지'}
                                onChange={(e) => setCrew_goal(e.target.value)}
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
                    <CrewLocationDiv onSetLocation={(detailLocation: string, location: string) => setLocation(detailLocation, location)} />
                    <br />
                    <h5>선택된 활동 지역 : {crew_location}</h5>
                </div>
                <br />
                {/* 운동 종목 */}
                <div className='form-group form-control' style={{ width: '100%' }}>
                    <label>운동 종목</label>
                    <CrewSearchDivEdit onSearchSport={setCrewSports}/>
                    <br />
                    <h5>선택된 운동 종목 : {crew_sport}</h5>
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
                                onChange={(e) => setCrew_gender(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="male">남성</label>

                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="여성"
                                checked={crew_gender === '여성'}
                                onChange={(e) => setCrew_gender(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="female">여성</label>

                            <input
                                type="radio"
                                id="all"
                                name="gender"
                                value="혼성"
                                checked={crew_gender === '혼성'}
                                onChange={(e) => setCrew_gender(e.target.value)}
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
                        <div className="d-flex tabs  w-100" style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="small"
                                name="frequency"
                                value="주 1~3회"
                                checked={crew_frequency === '주 1~3회'}
                                onChange={(e) => setCrew_frequency(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="small">주 1~3회</label>

                            <input
                                type="radio"
                                id="middle"
                                name="frequency"
                                value="주 3~5회"
                                checked={crew_frequency === '주 3~5회'}
                                onChange={(e) => setCrew_frequency(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="middle">주 3~5회</label>

                            <input
                                type="radio"
                                id="big"
                                name="frequency"
                                value="주 5~7회"
                                checked={crew_frequency === '주 5~7회'}
                                onChange={(e) => setCrew_frequency(e.target.value)}
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
                    <div className="d-flex justify-content-between w-100">
                        {['10대', '20대', '30대', '40대', '50대'].map((age) => (
                            <div className="form-check form-check-inline w-100" key={age}>
                                <input
                                    type="checkbox"
                                    className="btn-check"
                                    id={age}
                                    value={age}
                                    checked={crew_age.includes(age)}
                                    onChange={() => handleAgeSelection(age)}
                                />
                                <label className="btn btn-light w-100 text-center" htmlFor={age}>{age}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                {/* 제목 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_title}
                        onChange={(e) => setCrew_title(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br/>
                {/* 게시글 여부 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>게시글 여부</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="d-flex tabs w-100 " style={{paddingLeft : 0, paddingRight : 0}}>
                            <input
                                type="radio"
                                id="yes"
                                name="postOption"
                                value={1}
                                checked={crew_state === 1}
                                onChange={(e) => setCrew_state(1)}
                            />
                            <label className="tab w-100 text-center" htmlFor="yes">게시글 게시</label>

                            <input
                                type="radio"
                                id="no"
                                name="postOption"
                                value={0}
                                checked={crew_state === 0}
                                onChange={(e) => setCrew_state(0)}
                            />
                            <label className="tab w-100 text-center" htmlFor="no">게시글 게시 안함</label>
                            <span className='glider2'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">크루 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
};

export default CrewCreateModal;
