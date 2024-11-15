import React, { useEffect, useState } from "react";  // useState 추가
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";
import { formatDate } from '../../../utils/dateFormat';
import CommentSection from "./CommentSection";
import { usePost } from '../../../hooks/community/usePost';


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
  onBack,
  onEdit,
  onDelete,
  onCommentDelete,
  comments,
  onAddComment,
  post_img1,
  post_img2,
  author,
  onCommentLike,
  onCommentDislike,
  getComments
}) => {
  const {
    liked,
    disliked,
    likeCount,
    dislikeCount,
    sortOrder,
    handleLike,
    handleDislike,
    handleSortOrderChange
  } = usePost();

  const [commentInput, setCommentInput] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const hashtagArray = post_hashtag ? post_hashtag.split(", ") : [];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        await getComments(post_id);
      } catch (error) {
        console.error("댓글 조회 중 오류 발생:", error);
      }
    };

    if (post_id) {
      fetchComments();
    }
  }, [post_id]);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <div className="post-detail">
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
    <div className="image-container">
      {imgLoading && <div>이미지 로딩중...</div>}
      <img
        src={`http://localhost:8001/static/${post_img1}`}
        alt="게시글 이미지 1"
        className="post-image"
        onLoad={() => {
          setImgLoading(false);
        }}
        onError={async (e) => {
          const target = e.currentTarget;
          if (target.getAttribute('data-failed')) {
            return;
          }
          
          try {
            // 이미지 URL로 직접 요청을 보내서 응답 확인
            const response = await fetch(`http://localhost:8001/static/${post_img1}`);
            console.log('이미지1 서버 응답:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              url: response.url
            });
          } catch (error) {
            console.error('이미지1 요청 실패:', error);
          }

          setImgLoading(false);
          target.setAttribute('data-failed', 'true');
          target.onerror = null;
        }}
      />
    </div>
  )}
  {post_img2 && (
    <div className="image-container">
      <img
        src={`http://localhost:8001/static/${post_img2}`}
        alt="게시글 이미지 2"
        className="post-image"
        onError={async (e) => {
          const target = e.currentTarget;
          if (target.getAttribute('data-failed')) {
            return;
          }

          try {
            const response = await fetch(`http://localhost:8001/static/${post_img2}`);
            console.log('이미지2 서버 응답:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              url: response.url
            });
          } catch (error) {
            console.error('이미지2 요청 실패:', error);
          }

          target.setAttribute('data-failed', 'true');
          target.onerror = null;
        }}
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