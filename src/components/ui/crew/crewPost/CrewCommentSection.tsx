import React, { useEffect, useState } from 'react';
import CrewComment from './CrewComment';
import { useAuth } from "context/AuthContext";
import api from 'services/api/axios';

function CrewCommentSection({ postId, crewId, onAddComment}: {postId:number, crewId:number, onAddComment: () => void}) {
  
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;

    // 댓글 전체 정보
    const [comments, setComments] = useState([]);
    // 댓글 작성 내용
    const [comment, setComment] = useState("");

    // 특정 게시물 댓글 조회 API
    const getComments = async() => {
        const params = {
            crew_post_id : postId,
            member_id : memberId,
            crew_id : crewId
        }
        try{
            const response = await api.get("crew/comment/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            console.log("댓글 조회 response : " , response.data);
            setComments(response.data);
        } catch(err) {
            console.log("댓글 조회 실패 ", err);
        }
    };

    useEffect(() => {
        getComments();
    },[])

    // 댓글 등록
    const handleCommentSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            crew_comments_content: comment,
            crew_post_id: postId,
            member_id: memberId,
            crew_id: crewId,
        }
        try{
            const response = await api.post("crew/comment/create", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log("댓글 등록 response : ", response.data);
            alert("댓글 등록에 성공했습니다.");
            getComments();
        } catch(err) {
            console.log("댓글 등록 에러", err);
            alert("댓글 등록에 실패했습니다.");
        }
    };

    // 댓글 삭제
    const onCommentDelete = async(comment:{crew_comments_id: number}) => {
        const params= {
            crew_post_id : postId,
            member_id: memberId,
            crew_comments_id:comment.crew_comments_id,
        }
        try{
            const response = await api.delete("crew/comment/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            console.log("댓글 삭제 response : ", response.data);
            alert("댓글이 삭제되었습니다.");
            getComments();
        } catch (err) {
            console.log("댓글 삭제 에러 ", err);
        }
    }

    return (
        <div className="comments-section">
            <div className="comments-list">
                {comments.map((comment) => (
                    <CrewComment
                        key={comment}
                        comment={comment}
                        onCommentDelete={() => onCommentDelete(comment)}
                        post_id={postId}
                    />
                ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                    />
                    <button type="submit" className="btn btn-primary">
                        작성
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrewCommentSection;
