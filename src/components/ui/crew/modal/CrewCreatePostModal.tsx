import React, { useEffect, useState } from 'react';
import './Modal.css';
import { useAuth } from "context/AuthContext";
import api from 'services/api/axios';

function CrewCreatePostModal({ crewId, onClick, }: { crewId: number, onClick:() => void }) {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;

    // 입력 필드 상태 관리
    const [crew_post_title, setCrew_post_title] = useState('');
    const [crew_post_content, setCrew_post_content] = useState('');
    const [crew_post_img, setCrew_post_img] = useState<File | null>(null);
    const [crew_post_state, setCrew_post_state] = useState(2);

    // 크루장
    const [crewLeader, setCrewLeader] = useState(0);

    useEffect(() => {
        const getCrewLeader = async() => {
            try {
                const response = await api.get(`crew/info/${crewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCrewLeader(response.data.member_id);
            } catch (err) {
                console.log("크루장 정보 조회 err", err);
            }
        }
        getCrewLeader();
    },[])

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
            data.append("ImgFile", crew_post_img);
        }
        data.append("crew_id", crewId.toString());
        data.append("member_id", memberId ? memberId.toString() : '');
        data.append("crew_post_state", crew_post_state.toString());

        // 크루 게시물 등록 API 
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
                {/* 공지글 여부 */}
                { crewLeader === memberId && (
                    <div className="form-control" style={{ width: '100%' }}>
                        <label>공지글 여부</label>
                        <div className="container d-flex justify-content-between w-100">
                            <div className="d-flex tabs w-100 " style={{paddingLeft : 0, paddingRight : 0}}>
                                <input
                                    type="radio"
                                    id="notification"
                                    name="postOption"
                                    value={1}
                                    checked={crew_post_state === 0}
                                    onChange={(e) => setCrew_post_state(0)}
                                />
                                <label className="tab w-100 text-center" htmlFor="notification">공지글</label>

                                <input
                                    type="radio"
                                    id="common"
                                    name="postOption"
                                    value={0}
                                    checked={crew_post_state === 2}
                                    onChange={(e) => setCrew_post_state(2)}
                                />
                                <label className="tab w-100 text-center" htmlFor="common">일반글</label>
                                <span className='glider2'></span>
                            </div>
                        </div>
                    </div>
                )}
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">게시물 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">취소</button>
                </div>
            </form>
        </div>
    );
};

export default CrewCreatePostModal;
