import React, { useState } from "react";
import './Modal.css';
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "services/api/axios";

function CrewIntroModal({ crew_id, onClick }: { crew_id: number, onClick: () => void }) {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;
    const navigate = useNavigate();

    const [crew_name, setCrew_name] = useState('');
    const [crew_intro_post, setCrew_intro_post] = useState('');
    const [crew_intro_img, setCrew_intro_img] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCrew_intro_img(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            crew_name,
            crew_intro_post,
            ...(crew_intro_img ? { crew_intro_img } : {}),
            crew_id,
            member_id
        };
        console.log('Data:', data);

        const updateCrewIntro = async() => {
            try {
                const response = await api.patch(`crew/intro/update`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> updateCrewIntro response", response);
                alert("크루 소개글 수정이 완료되었습니다.");
                onClick();
            } catch (error) {
                console.error('Error updating crew intro:', error);
                alert("크루 소개글 수정에 실패 했습니다.");
            }
        };
        updateCrewIntro();
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 사진 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>사진</label>
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 크루 이름 (조건부 렌더링) */}
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
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>크루 소개 내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_intro_post}
                        onChange={(e) => setCrew_intro_post(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">소개글 수정</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewIntroModal;
