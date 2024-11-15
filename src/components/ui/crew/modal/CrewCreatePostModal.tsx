import React, { useEffect, useState } from 'react';
import './Modal.css';
import { useAuth } from "context/AuthContext";
import api from 'services/api/axios';

function CrewCreatePostModal({ crewId, onClick, }: { crewId: number, onClick:() => void }) {
    const { state } = useAuth();
    const token = state.token;
    const member_id = state.memberId;

    // 입력 필드 상태 관리
    const [crew_post_title, setCrew_post_title] = useState('');
    const [crew_post_content, setCrew_post_content] = useState('');
    const [crew_post_img, setCrew_post_img] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCrew_post_img(e.target.files[0]);
        }
      };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("crew_post_title", crew_post_title);
        data.append("crew_post_content", crew_post_content);
        if (crew_post_img) {
            data.append("imgFile", crew_post_img);
        }
        data.append("crew_id", crewId.toString());
        data.append("member_id", member_id ? member_id.toString() : '');

        const createCrewPost = async () => {
            try {
                const response = await api.post(`crew/post/create`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("debug >>> updateCrewIntro response", response);
                alert("게시물 작성이 완료되었습니다.");
                onClick();
            } catch (error) {
                console.error("Error updating crew intro:", error);
                alert("게시물 작성에 실패 했습니다.");
            }
          };
          createCrewPost();
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} >
                {/* 제목 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_post_title}
                        onChange={(e) => setCrew_post_title(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 내용 */}
                <div className="form-group form-control" style={{ width: '100%' }}>
                    <label>내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={crew_post_content}
                        onChange={(e) => setCrew_post_content(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                {/* 사진 */}
                <div className="form-group form-control" style={{ width: "100%" }}>
                    <label>사진</label>
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                        style={{ width: "100%" }}
                    />
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

export default CrewCreatePostModal;
