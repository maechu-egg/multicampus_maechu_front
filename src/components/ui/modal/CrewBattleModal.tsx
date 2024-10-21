import React, { useState } from "react";
import './Modal.css';

function CrewBattleModal() {
    const [goal, setGoal] = useState('체중감량');
    const [battleName, setBattleName] = useState('');
    const [battleContent, setBattleContent] = useState('');
    const [battleRecruitment, setBattleRecruitment] = useState('');
    const [battleEndDate, setBattleEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            goal,
            battleName,
            battleContent,
            battleRecruitment,
            battleEndDate
        };
        console.log('Form Data:', formData);
    };

    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 활동 지역 */}
                <div className="form-group form-control">
                    <label>활동 지역</label>
                    <input
                        type="text"
                        className="form-control"
                        value={battleName}
                        onChange={(e) => setBattleName(e.target.value)}
                    />
                </div>
                <br />
                {/* 배틀 목표 */}
                <div className="form-control">
                    <label>배틀 목표</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="tabs form-check form-check-inline w-100">
                            <input
                                type="radio"
                                id="diet"
                                name="goal"
                                value="체중감량"
                                checked={goal === '체중감량'}
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="diet">체중감량</label>

                            <input
                                type="radio"
                                id="effort"
                                name="goal"
                                value="매일노력"
                                checked={goal === '매일노력'}
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="effort">매일노력</label>

                            <input
                                type="radio"
                                id="muscles"
                                name="goal"
                                value="근성장"
                                checked={goal === '근성장'}
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="muscles">근성장</label>
                            <span className='glider'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 모집 마감 날짜 */}
                <div className="form-group form-control">
                    <label>모집 마감 날짜</label>
                    <input
                        type="date"
                        className="form-control"
                        value={battleRecruitment}
                        onChange={(e) => setBattleRecruitment(e.target.value)}
                    />
                </div>
                <br />
                {/* 종료 날짜 */}
                <div className="form-group form-control">
                    <label>종료 날짜</label>
                    <input
                        type="date"
                        className="form-control"
                        value={battleEndDate}
                        onChange={(e) => setBattleEndDate(e.target.value)}
                    />
                </div>
                <br />
                {/* 배틀 내용 */}
                <div className="form-group form-control">
                    <label>배틀 내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={battleContent}
                        onChange={(e) => setBattleContent(e.target.value)}
                    />
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">배틀 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewBattleModal;