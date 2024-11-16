import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";
import { formatDate } from '../../../utils/dateFormat';  
import CommentSection from "./CommentSection";
import { usePost } from "hooks/community/usePost";

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  comment_like_status: boolean;
  comment_dislike_status: boolean;
  commentAuthor: boolean;
}

interface PostDetailProps {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword: string;
  post_hashtag: string;
  likeStatus: boolean;
  unlikeStatus: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCommentDelete: (commentId: number, postId: number) => void;
  currentUserNickname: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  post_img1?: string;
  post_img2?: string;
  post_unlike_counts: number;
  post_like_counts: number;
  commets_count: number;
  member_id: number;
  author: boolean;
  onCommentLike: (commentId: number, postId: number) => void;
  onCommentDislike: (commentId: number, postId: number) => void;
  getComments: (postId: number) => Promise<void>;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post_id,
  post_title,
  post_contents,
  post_nickname,
  post_date,
  post_views,
  post_up_sport,
  post_sport,
  post_sports_keyword,
  post_hashtag,
  likeStatus,
  unlikeStatus,
  onBack,
  onEdit,
  onDelete,
  onCommentDelete,
  comments,
  onAddComment,
  post_img1,
  post_img2,
  post_unlike_counts,
  post_like_counts,
  author,
  onCommentLike,
  onCommentDislike,
  getComments
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [commentInput, setCommentInput] = useState("");
  const hashtagArray = post_hashtag ? post_hashtag.split(',') : [];

  const { 
    liked, 
    setLiked,
    disliked, 
    setDisliked,
    likeCount, 
    setLikeCount,
    dislikeCount, 
    setDislikeCount,
    handleLike, 
    handleDislike 
  } = usePost();

  useEffect(() => {
    setLikeCount(post_like_counts);
    setDislikeCount(post_unlike_counts);
    setLiked(likeStatus);
    setDisliked(unlikeStatus);
  }, [post_like_counts, post_unlike_counts, likeStatus, unlikeStatus, setLikeCount, setDislikeCount, setLiked, setDisliked]);

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="post-detail">
      <input type="hidden" value={post_id} />
      
      <div className="post-category">
        {post_up_sport} 게시판 - {post_sport} - {post_sports_keyword}
      </div>

      <hr className="border border-secondary border-1 opacity-50" />

      <div className="post-header">
        <h2>{post_title}</h2>
        <div className="post-info">
          <span className="author">{post_nickname}</span>
          <div className="info-right">
            <span className="date">{formatDate(post_date)}</span>
            <span className="views">조회수: {post_views}</span>
          </div>
        </div>
      </div>

      <hr className="border border-secondary border-1 opacity-50" />

      <div className="post-content">{post_contents}</div>

      <div className="post-images">
        {post_img1 && (
          <div className="post-image">
            <img
              src={post_img1}
              alt="게시글 이미지 1"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        {post_img2 && (
          <div className="post-image">
            <img
              src={post_img2}
              alt="게시글 이미지 2"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>

      {hashtagArray.length > 0 && (
        <div className="post-tags">
          {hashtagArray.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="reaction-buttons">
        {author && (
          <div className="edit-delete-buttons">
            <button className="btn btn-primary me-2" onClick={onEdit}>
              수정
            </button>
            <button className="btn btn-danger me-2" onClick={onDelete}>
              삭제
            </button>
          </div>
        )}
        <div className="like-dislike-buttons">
          <button
            className={`btn ${liked ? "btn-primary" : "btn-outline-primary"} me-2`}
            onClick={() => handleLike(post_id)}
          >
            <FaThumbsUp /> {likeCount}
          </button>
          <button
            className={`btn ${disliked ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => handleDislike(post_id)}
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
            className={`btn btn-sm ${
              sortOrder === "asc" ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={() => handleSortOrderChange("asc")}
          >
            등록순
          </button>
          <button
            className={`btn btn-sm ${
              sortOrder === "desc" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleSortOrderChange("desc")}
          >
            최신순
          </button>
        </div>

        <CommentSection
          comments={sortedComments}
          postId={post_id}
          onAddComment={onAddComment}
          onCommentDelete={onCommentDelete}
          onCommentLike={onCommentLike}
          onCommentDislike={onCommentDislike}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
        />
      </div>
    </div>
  );
};

export default PostDetail;