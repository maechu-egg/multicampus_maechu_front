import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { formatDate } from '../../../utils/dateFormat';
import type { Comment } from '../../../hooks/community/useComment';



interface CommentItemProps {
  comment: Comment;
  onCommentDelete: (commentId: number, postId: number) => void;
  onCommentLike: (commentId: number, postId: number) => void;
  onCommentDislike: (commentId: number, postId: number) => void;
  post_id: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onCommentDelete,
  onCommentLike,
  onCommentDislike,
  post_id
}) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.date)}</span>
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-reactions">
        {comment.commentAuthor && (
          <button
            className="btn btn-danger me-2"
            onClick={() => onCommentDelete(comment.id, post_id)}
          >
            삭제
          </button>
        )}
        <button
          className={`btn ${comment.comment_like_status ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => onCommentLike(comment.id, post_id)}
        >
          <FaThumbsUp /> {comment.comment_like_counts}
        </button>
        <button
          className={`btn ${comment.comment_dislike_status ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={() => onCommentDislike(comment.id, post_id)}
        >
          <FaThumbsDown /> {comment.comment_dislike_counts}
        </button>
      </div>
    </div>
  );
};

export default CommentItem;