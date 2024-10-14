import React, { useState } from 'react';

const CreateCrewForm = () => {
    // 입력 필드 상태 관리
    const [crewName, setCrewName] = useState('');
    const [title, setTitle] = useState('');
    const [local, setLocal] = useState('');

    // 라디오 버튼 상태 관리
    const [goal, setGoal] = useState('');
    const [gender, setGender] = useState('');
    const [frequency, setFrequency] = useState('');
    const [postOption, setPostOption] = useState('');

    // 체크박스 상태 관리 (선호 나이)
    const [ages, setAge] = useState<string[]>([]);

    // 체크박스 선택 핸들러
    const handleAgeSelection = (age: string) => {
        if (ages.includes(age)) {
        setAge(ages.filter((item) => item !== age));
        } else {
        setAge([...ages, age]);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
        crewName,
        title,
        local,
        goal,
        gender,
        frequency,
        postOption,
        ages,
        };
        console.log('Form Data:', formData);
        // formData를 서버로 전송하는 로직 추가 가능
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 크루 이름 */}
                <div className="form-group form-control">
                    <label>크루 이름</label>
                    <input
                    type="text"
                    className="form-control"
                    value={crewName}
                    onChange={(e) => setCrewName(e.target.value)}
                    />
                </div>
                <br/>
                {/* 제목 */}
                <div className="form-group form-control">
                    <label>제목</label>
                    <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <br/>
                {/* 크루 목표 */}
                <div className='form-control'>
                    <label>크루 목표</label>
                    <div className="container d-flex justify-content-between w-100" >
                        <div className="tabs form-check form-check-inline w-100">
                            <input type="radio" id="radio-1" name="tabs"/>
                            <label className="tab w-100 text-center" htmlFor='radio-1'>다이어트</label>

                            <input type="radio" id="radio-2" name="tabs"/>
                            <label className="tab w-100 text-center" htmlFor='radio-2'>운동</label>

                            <input type="radio" id="radio-3" name="tabs"/>
                            <label className="tab w-100 text-center" htmlFor='radio-3'>근성장</label>

                            <span className='glider'></span>
                        </div>
                    </div>
                </div>
                <br/>
                {/* 활동 지역 */}
                <div className="form-group form-control">
                    <label>활동 지역</label>
                    <input
                    type="text"
                    className="form-control"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    />
                </div>
                <br/>
                {/* 선호 성별 */}
                <div className="form-group form-control">
                    <label>선호 성별</label>
                    <div className="d-flex justify-content-between w-100">
                        <div className="form-check form-check-inline w-100">
                            <input
                                type="radio"
                                className="btn-check"
                                name="gender"
                                id="male"
                                value="남성"
                                checked={gender === '남성'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor="male">남성</label>
                        </div>
                        <div className="form-check form-check-inline w-100">
                            <input
                                type="radio"
                                className="btn-check"
                                name="gender"
                                id="female"
                                value="여성"
                                checked={gender === '여성'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor="female">여성</label>
                        </div>
                        <div className="form-check form-check-inline w-100">
                            <input
                                type="radio"
                                className="btn-check"
                                name="gender"
                                id="all"
                                value="혼성"
                                checked={gender === '혼성'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor="all">혼성</label>
                        </div>
                    </div>
                </div>
                <br/>
                {/* 활동 빈도 */}
                <div className="form-group form-control">
                    <label>활동 빈도</label>
                    <div className='d-flex justify-content-between w-100'>
                        <div className="form-check form-check-inline w-100">
                            <input
                            type="radio"
                            className="btn-check"
                            name="frequency"
                            id="small"
                            value="주 1~3회"
                            checked={frequency === '주 1~3회'}
                            onChange={(e) => setFrequency(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor="small">주 1~3회</label>
                        </div>
                        <div className="form-check form-check-inline w-100">
                            <input
                            type="radio"
                            className="btn-check"
                            name="frequency"
                            id="middle"
                            value="주 3~5회"
                            checked={frequency === '주 3~5회'}
                            onChange={(e) => setFrequency(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor="middle">주 3~5회</label>
                        </div>
                        <div className="form-check form-check-inline w-100">
                            <input
                            type="radio"
                            className="btn-check"
                            name="frequency"
                            id="big"
                            value="주 5~7회"
                            checked={frequency === '주 5~7회'}
                            onChange={(e) => setFrequency(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor='big'>주 5~7회</label>
                        </div>
                    </div>
                </div>
                <br/>
                {/* 선호 나이 */}
                <div className="form-group form-control">
                    <label>선호 나이</label>
                    <div className='d-flex justify-content-between w-100'>
                        {['10대', '20대', '30대', '40대', '50대'].map((age) => (
                            <div className="form-check form-check-inline w-100" key={age}>
                                <input
                                    type="checkbox"
                                    className="btn-check"
                                    id={age}
                                    value={age}
                                    checked={ages.includes(age)}
                                    onChange={() => handleAgeSelection(age)}
                                />
                                <label className="btn btn-light w-100 text-center" htmlFor={age}>{age}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br/>
                {/* 게시글 여부 */}
                <div className="form-group form-control">
                    <label>게시글 여부</label>
                    <div className='d-flex justify-content-between w-100'>
                        <div className="form-check form-check-inline w-100">
                            <input
                            type="radio"
                            className="btn-check"
                            name="postOption"
                            id="yes"
                            value="yes"
                            checked={postOption === 'yes'}
                            onChange={(e) => setPostOption(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor='yes'>게시글 게시</label>
                        </div>
                        <div className="form-check form-check-inline w-100">
                            <input
                            type="radio"
                            className="btn-check"
                            name="postOption"
                            id="no"
                            value="no"
                            checked={postOption === 'no'}
                            onChange={(e) => setPostOption(e.target.value)}
                            />
                            <label className="btn btn-light w-100 text-center" htmlFor='no'>게시글 게시 안함</label>
                        </div>
                    </div>
                </div>
                <br/>
                {/* 폼 제출 버튼 */}
                <div className='d-flex justify-content-end'>
                    <button type="submit" className="btn btn-primary">크루 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger">취소</button>
                </div>
            </form>
        </div>
    );
};

export default CreateCrewForm;
