import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';

function CrewModal() {
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
    const [member_id, setMember_id] = useState(0);

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
            member_id :72
        };
        console.log("debug >>> data", data);

        const createCrew = async() => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3Mjk3MzAxMjAsImV4cCI6MTcyOTgxNjUyMH0.HoKyARnnB4G5GRd6e5uq26LN8qq9PS1p8KeBX-3XpCo'; // 실제 토큰 값으로 대체하세요
                const response = await axios.post(`http://localhost:8001/crew/create`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> createCrew response", response);
            } catch (error) {
                console.error('Error creating crew:', error);
                alert("크루 생성에 실패 했습니다.");
            }
        };
        createCrew();
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
                        onChange={(e) => setCrew_name(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 크루 목표 */}
                <div className="form-control" style={{ width: '100%' }}>
                    <label>크루 목표</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="tabs form-check form-check-inline w-100">
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
                                value="운동"
                                checked={crew_goal === '운동'}
                                onChange={(e) => setCrew_goal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-2">운동</label>

                            <input
                                type="radio"
                                id="radio-3"
                                name="goal"
                                value="근성장"
                                checked={crew_goal === '근성장'}
                                onChange={(e) => setCrew_goal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="radio-3">근성장</label>
                            <span className='glider'></span>
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
                        onChange={(e) => setCrew_location(e.target.value)}
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
                        onChange={(e) => setCrew_sport(e.target.value)} // 값이 변경될 때 상태 업데이트
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
                        <div className="tabs form-check form-check-inline w-100">
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
                        <div className="tabs form-check form-check-inline w-100">
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
                        <div className="tabs form-check form-check-inline w-100">
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

export default CrewModal;
