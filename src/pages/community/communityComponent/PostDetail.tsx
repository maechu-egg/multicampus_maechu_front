import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  likeCount: number;
  dislikeCount: number;
}

interface PostDetailProps {
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  category: string;
  tags: string[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;  
  currentUserNickname: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onCommentReaction: (commentId: number, type: 'like' | 'dislike') => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  title,
  content,
  author,
  date,
  views,
  category,
  tags,
  onBack,
  onEdit,
  onDelete,
  currentUserNickname,
  comments,
  onAddComment,
  onCommentReaction
}) => {
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
      if (disliked) {
        setDislikeCount(prev => prev - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDislikeCount(prev => prev + 1);
      setDisliked(true);
      if (liked) {
        setLikeCount(prev => prev - 1);
        setLiked(false);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim() !== "") {
      onAddComment(commentInput);
      setCommentInput("");
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  return (
    <div className="post-detail">
      <div className="post-category">
        {category} 게시판
      </div>
      <hr className="border border-secondary border-1 opacity-50" />
      <div className="post-header">
        <h2>{title}</h2>
        <div className="post-info">
          <span className="author">{author}</span>
          <div className="info-right">
            <span className="date">{date}</span>
            <span className="views">조회수: {views}</span>
          </div>
        </div>
      </div>
      <hr className="border border-secondary border-1 opacity-50" />
      <div className="post-content">{content}</div>

      {tags && tags.length > 0 && (
        <div className="post-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="reaction-buttons">
        <div className="edit-delete-buttons">
            <button className="btn btn-primary me-2" onClick={onEdit}>
              수정
            </button>
            <button className="btn btn-danger me-2" onClick={onDelete}>
              삭제
            </button>
        </div>
        <div className="like-dislike-buttons">
          <button
            className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={handleLike}
          >
            <FaThumbsUp /> {likeCount}
          </button>
          <button
            className={`btn ${disliked ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={handleDislike}
          >
            <FaThumbsDown /> {dislikeCount}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          뒤로가기
        </button>
      </div>

      <hr className="mt-4" />
      <div className="comments-section">
        <div className="comment-sort-buttons">
          <button
            className={`btn btn-sm ${sortOrder === 'asc' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setSortOrder('asc')}
          >
            등록순
          </button>
          <button
            className={`btn btn-sm ${sortOrder === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSortOrder('desc')}
          >
            최신순
          </button>
        </div>

        <div className="comments-list">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
              <div className="comment-reactions">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onCommentReaction(comment.id, 'like')}
                >
                  <FaThumbsUp /> {comment.likeCount}
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onCommentReaction(comment.id, 'dislike')}
                >
                  <FaThumbsDown /> {comment.dislikeCount}
                </button>
              </div>
            </div>
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
    </div>
  );
};

export default PostDetail;