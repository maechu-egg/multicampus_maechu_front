import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useComment, type Comment } from "../../../hooks/community/useComment"; 
import "./Comment.css"; 
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  onAddComment: (content: string) => void;
  onCommentDelete: (commentId: number, postId: number) => void;
  onCommentLike: (commentId: number, postId: number) => void;
  onCommentDislike: (commentId: number, postId: number) => void;
  commentInput: string;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  };
  useEffect(() => {
    console.log("댓글 목록 업데이트됨:", comments);
  }, [comments]);
  const handleConfirmDeleteClick  = async () => {
    if (commentToDelete !== null) {
     onCommentDelete(commentToDelete, postId);

    }
    setShowConfirmModal(false);
    setCommentToDelete(null);

  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setCommentToDelete(null);
  };
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
            // onCommentDelete={onCommentDelete}
            onCommentDelete={handleDeleteClick}
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
          <button type="submit" id="comment-submit-btn" className="btn btn-primary">
            작성
          </button>
        </div>
      </form>

         {/* Confirm Delete Modal */}
         <ConfirmModal
        isOpen={showConfirmModal}
        title="⚠️댓글 삭제"
        message="정말로 이 댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDeleteClick }
        onCancel={handleCancelDelete}
      />

    </div>
  );
};

export default CommentSection;
