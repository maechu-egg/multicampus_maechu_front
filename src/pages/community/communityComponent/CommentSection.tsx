import React from "react";
import CommentItem from "./CommentItem";
import type { Comment } from "../../../hooks/community/useComment"; // type-only import 사용

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  onAddComment: (content: string) => void;
  onCommentDelete: (commentId: number, postId: number) => void;
  onCommentLike: (commentId: number, postId: number) => void;
  onCommentDislike: (commentId: number, postId: number) => void;
  commentInput: string;
  setCommentInput: (value: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  onAddComment,
  onCommentDelete,
  onCommentLike,
  onCommentDislike,
  commentInput,
  setCommentInput,
}) => {
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim() !== "") {
      onAddComment(commentInput);
      setCommentInput("");
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentDelete={onCommentDelete}
            onCommentLike={onCommentLike}
            onCommentDislike={onCommentDislike}
            post_id={postId}
          />
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
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

export default CommentSection;
