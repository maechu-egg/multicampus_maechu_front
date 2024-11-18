import React from 'react';
import { useAuth } from "context/AuthContext";

interface CrewComment {
    crew_comments_content: string;
    crew_comments_date: string;
    crew_comments_id: number;
    crew_post_id: number;
    nickname: string;
    member_id: number;
}

function CrewComment ({ comment, onCommentDelete, post_id } : {comment:CrewComment, onCommentDelete:() => void, post_id:number}) {

    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;

    return (
        <div className="comment">
            <div className="comment-header">
                <span className="comment-author">{comment.nickname}</span>
                <span className="comment-date">{comment.crew_comments_date}</span>
            </div>
            <div className="comment-content">{comment.crew_comments_content}</div>
            <div className="comment-reactions">
                {comment.member_id === memberId && (
                    <button
                        className="btn btn-danger me-2"
                        onClick={onCommentDelete}
                    >
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
};

export default CrewComment;
