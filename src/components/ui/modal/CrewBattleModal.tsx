import React, { useState } from "react";
import './Modal.css';
import api from "services/api/axios";

function CrewBattleModal() {
    const [battle_goal, setGoal] = useState('');
    const [battle_name, setBattleName] = useState('');
    const [battle_content, setBattleContent] = useState('');
    const [battle_end_recruitment, setBattleRecruitment] = useState('');
    const [battle_end_date, setBattleEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            battle_goal,
            battle_name,
            battle_content,
            battle_end_recruitment,
            battle_end_date,
            crew_id: 1
        };
        console.log('Form Data:', data);
        const createBattle = async() => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3MzAwNzUyNTIsImV4cCI6MTczMDE2MTY1Mn0.lfn7OzR_jL8yO4BxJFkLg0GPXT2l6eJIBbFjjkooTQ4'; // 실제 토큰 값으로 대체하세요
                const response = await api.post(`crew/battle/create`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> createBattle response", response.data);
            } catch (error) {
                console.error('Error creating crew:', error);
                alert("배틀 생성에 실패 했습니다.");
            }
        };
        createBattle();
    };

    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 배틀 이름 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>배틀 이름</label>
                    <input
                        type="text"
                        className="form-control"
                        value={battle_name}
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
                        value={battle_goal}
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
                        value={battle_end_recruitment}
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
                        value={battle_end_date}
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
                        value={battle_content}
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