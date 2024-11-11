import React, { useEffect, useState } from "react";
import './Modal.css';
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

function CrewJoinBattleModal({battle_id, crewId, onClick}: {battle_id: number, crewId:number, onClick:() => void}) {
    const { state } = useAuth();
    const token = state.token;  
    const memberId = state.memberId;
    const navigate = useNavigate();

    const [battle_goal, setGoal] = useState('');
    const [battle_name, setBattleName] = useState('');
    const [battle_content, setBattleContent] = useState('');
    const [battle_end_recruitment, setBattleRecruitment] = useState('');
    const [battle_end_date, setBattleEndDate] = useState('');

    const handleSubmit = async() => {
        try{
            const data = {
                battle_id: battle_id,
                member_id: memberId,
                crew_id: crewId
            }
            const response = await api.post(`crew/battle/member/join`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("배틀에 참여 되었습니다.");
            console.log("debug >>> handleSubmit response", response.data);
            onClick();
        } catch (error) {
            console.log("debug >>> handleSubmit error", error);
        }
    };

    useEffect(() => {
        const getBattleInfo = async () => {
            try{
                const response = await api.get(`crew/battle/list/detail?crew_id=${crewId}&battle_id=${battle_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> getBattleInfo참가 response", response.data);
                setBattleName(response.data.battle_name);
                setGoal(response.data.battle_goal);
                setBattleRecruitment(response.data.battle_end_recruitment.split(' ')[0]);
                setBattleEndDate(response.data.battle_end_date.split(' ')[0]);
                setBattleContent(response.data.battle_content);
            } catch (error) {
                console.log("debug >>> getBattleInfo error", error);
            }
        }
        getBattleInfo();
    }, [battle_id]);

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
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">배틀 참가</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewJoinBattleModal;