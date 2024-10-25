import React, { useState } from "react";
import './Modal.css';
import axios from "axios";

function CrewIntroModal() {
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
            crew_intro_img: crew_intro_img ? crew_intro_img.name : null, // 파일 이름을 보낼 경우
            crew_id: 22
        };
        console.log('Data:', data);

        const updateCrewIntro = async() => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3Mjk3MzAxMjAsImV4cCI6MTcyOTgxNjUyMH0.HoKyARnnB4G5GRd6e5uq26LN8qq9PS1p8KeBX-3XpCo'; // 실제 토큰 값으로 대체하세요
                const response = await axios.post(`http://localhost:8001/crew/intro/update`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">소개글 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewIntroModal;
