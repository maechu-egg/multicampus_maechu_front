import React, { useState } from "react";
import './Modal.css';

function CrewBattleModal() {
    const [goal, setGoal] = useState('');
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
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>활동 지역</label>
                    <input
                        type="text"
                        className="form-control"
                        value={battleName}
                        onChange={(e) => setBattleName(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 배틀 목표 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>배틀 목표</label>
                    <input
                        type="text"
                        className="form-control"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 모집 마감 날짜 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>모집 마감 날짜</label>
                    <input
                        type="date"
                        className="form-control"
                        value={battleRecruitment}
                        onChange={(e) => setBattleRecruitment(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 종료 날짜 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>종료 날짜</label>
                    <input
                        type="date"
                        className="form-control"
                        value={battleEndDate}
                        onChange={(e) => setBattleEndDate(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 배틀 내용 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>배틀 내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={battleContent}
                        onChange={(e) => setBattleContent(e.target.value)}
                        style={{ width: '100%' }}
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