import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import "./CrewPostDetail.css";
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";
import CrewCommentSection from "./CrewCommentSection";
import CrewCreatePostModal from "../modal/CrewUpdatePostModal";


function CrewPostDetail({post, crewId, onBack} : {post:number, crewId:number, onBack: () => void}) {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;

    // 좋아요 눌렀는지 확인
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([])

    const [crew_post_title, setCrew_post_title] = useState("");
    const [crew_post_content, setCrew_post_content] = useState("");
    const [crew_post_img, setCrew_post_img] = useState("");
    const [crew_post_like, setCrew_post_like] = useState(0);
    const [crew_post_date, setCrew_post_date] = useState("");
    const [crew_post_state, setCrew_post_state] = useState(0);
    const [nickname, setNickname] = useState("");
    const [member_id, setMember_id]= useState(0);

    // 게시물 상세조회 API
    const getPostDetail = async() => {
        const params = {
            crew_id: crewId,
            crew_post_id: post,
        };
        try{
            const response = await api.get("crew/post/detail", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            console.log("게시물 상세조회 ", response.data);
            setCrew_post_title(response.data.crew_post_title);
            setCrew_post_content(response.data.crew_post_content);
            setCrew_post_img(response.data.crew_post_img);
            setCrew_post_like(response.data.crew_post_like);
            setCrew_post_date(response.data.crew_post_date);
            setCrew_post_state(response.data.crew_post_state);
            setNickname(response.data.nickname);
            setMember_id(response.data.member_id);
        } catch(err) {
            console.log("게시물 상세 조회 실패 ", err);
        }
    }

    // 좋아요 체크 API
    const getIsLike = async() => {
        const params = {
            crew_post_id: post,
            member_id: memberId,
            crew_id: crewId
        }
        try{
            const response = await api.get("crew/post/like/check", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            console.log("좋아요 체크 response : ", response.data);
            setIsLiked(response.data.isLiked);
        } catch ( err ) {
            console.log("좋아요 체크 에러 ", err);
        }
    }

    useEffect(() => {
        getPostDetail();
        getIsLike();
    }, []);

    // 게시글 좋아요
    const handleLike = async () => {
        try {
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
            if (isLiked === false) {
                // 좋아요 추가 요청
                try {
                    // POST 매핑 추가
                } catch (err) {
                    console.log("좋아요 추가 에러 ", err);
                }
            } else if (isLiked === true) {
                // 좋아요 삭제 요청
                try{
                    // DELETE 매핑 추가
                } catch (err) {
                    console.log("좋아요 삭제 에러 ", err);
                }
            }
        } catch (error) {
            console.error('좋아요 요청 중 오류 발생 : ', error);
        }
    };

    const onDelete = async() => {
        const confirmDelete = window.confirm("정말로 게시물을 삭제하시겠습니까?"); // 삭제 확인 대화상자 추가
        if (!confirmDelete) return; // 사용자가 취소하면 함수 종료

        const params = {
            crew_id: crewId,
            member_id: memberId,
            crew_post_id :post,
        }
        try{
            const response = await api.delete("crew/post/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            })
            console.log("게시물 삭제 response: ", response.data);
            alert("게시물이 삭제되었습니다.");
            onBack();
        } catch (err) {
            console.log("게시물 삭제 에러 ", err);
        }
    }

    const onAddComment = () => {

    }
    
    return (
        <div className="post-detail">
            <hr className="border border-secondary border-1 opacity-50" />
            <div className="post-header">
                <h2>{crew_post_title}</h2>
                <div className="post-info">
                    <span className="author">{nickname}</span>
                    <div className="info-right">
                        <span className="date">{crew_post_date}</span>
                    </div>
                </div>
            </div>
            <hr className="border border-secondary border-1 opacity-50" />
            <div className="post-content">{crew_post_content}</div>

            <div className="post-images">
                <div className="post-image">
                    {crew_post_img != null && (
                        <img src={`http://localhost:8001/static/${crew_post_img}`} alt="image" style={{ maxWidth: "100%", height: "auto" }} />
                    )}
                </div>
            </div>

            <div className="reaction-buttons">
                {member_id == memberId && (
                    <div className="edit-delete-buttons">
                        <button 
                            className="btn btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#postUpdateModal"
                        >
                            수정
                        </button>
                        <button className="btn btn-danger me-2" onClick={onDelete}>
                            삭제
                        </button>
                    </div>
                )}
                <div className="like-dislike-buttons">
                    <button
                        className={`btn ${isLiked ? "btn-primary" : "btn-outline-primary"} me-2`}
                        onClick={handleLike}
                    >
                        <FaThumbsUp /> {crew_post_like}
                    </button>
                </div>
                <button className="btn btn-secondary" onClick={onBack}>
                    뒤로가기
                </button>
            </div>

            <hr className="mt-4" />
            <div className="comments-section">
                {/* CommentSection 컴포넌트 추가 */}
                <CrewCommentSection
                    postId={post}
                    onAddComment={onAddComment}
                    crewId={crewId}
                />
            </div>

            {/* 크루 게시물 수정 모달창 */}
            <div className="modal fade" id="postUpdateModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="postUpdateModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered"> 
                    <div className="modal-content" style={{width: "100%", maxWidth: "none"}}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="postUpdateModalLabel">게시물 수정</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewCreatePostModal crewId={crewId} crewPostId={post} onClick={getPostDetail}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrewPostDetail;
