import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";
import axios from "axios";
import { formatDate } from '../../../utils/dateFormat';  
import CommentSection from "./CommentSection";


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
  getComments  
}) => {
  const [liked, setLiked] = useState(likeStatus);
  const [disliked, setDisliked] = useState(unlikeStatus);
  const [likeCount, setLikeCount] = useState(post_like_counts);
  const [dislikeCount, setDislikeCount] = useState(post_unlike_counts);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [commentInput, setCommentInput] = useState("");
  const hashtagArray = post_hashtag ? post_hashtag.split(", ") : [];

 // 댓글 조회를 위한 useEffect 추가
 useEffect(() => {
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      await getComments(post_id);  // getComments 함수 호출
    } catch (error) {
      console.error("댓글 조회 중 오류 발생:", error);
    }
  };

  fetchComments();
}, [post_id]); // post_id가 변경될 때마다 댓글을 다시 불러옴


  // 댓글 정렬
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  // 게시글 좋아요
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      let response;
      if (!liked) {
        response = await axios.post(
          `http://localhost:8001/useractivity/${post_id}/likeinsert`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 좋아요를 눌렀습니다.");
          } else if (response.data.result) {
            setLikeCount(response.data.likeCount);
            setLiked(true);
            if (disliked) {
              setDislikeCount((prev) => prev - 1);
              await axios.delete(
                `http://localhost:8001/useractivity/${post_id}/unlikedelete`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setDisliked(false);
            }
          } else {
            alert(response.data.message || "좋아요 처리에 실패했습니다.");
          }
        }
      } else if (liked) {
        response = await axios.delete(
          `http://localhost:8001/useractivity/${post_id}/likedelete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable === false) {
            alert("이미 좋아요를 취소한 상태입니다.");
          } else if (response.data.result) {
            setLikeCount(response.data.likeCount);
            setLiked(false);
          } else {
            alert(response.data.message || "좋아요 취소에 실패했습니다.");
          }
        }
      }
    } catch (error) {
      console.error("좋아요 요청 중 오류 발생:", error);
    }
  };

  // 싫어요 처리
  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      let response;
      if (!disliked) {
        response = await axios.post(
          `http://localhost:8001/useractivity/${post_id}/unlikeinsert`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 싫어요를 눌렀습니다.");
          } else if (response.data.result) {
            setDislikeCount(response.data.unLikeCount);
            setDisliked(true);
            if (liked) {
              setLikeCount((prev) => prev - 1);
              await axios.delete(
                `http://localhost:8001/useractivity/${post_id}/likedelete`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setLiked(false);
            }
          } else {
            alert(response.data.message || "싫어요 처리에 실패했습니다.");
          }
        }
      } else if (disliked) {
        response = await axios.delete(
          `http://localhost:8001/useractivity/${post_id}/unlikedelete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable === false) {
            alert("이미 싫어요를 취소한 상태입니다.");
          } else if (response.data.result) {
            setDislikeCount(response.data.unLikeCount);
            setDisliked(false);
          } else {
            alert(response.data.message || "싫어요 취소에 실패했습니다.");
          }
        }
      }
    } catch (error) {
      console.error("싫어요 요청 중 오류 발생:", error);
    }
  };

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
              src={`http://localhost:8001/static/${post_img1}`}
              alt="게시글 이미지 1"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        {post_img2 && (
          <div className="post-image">
            <img
              src={`http://localhost:8001/static/${post_img2}`}
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
            onClick={handleLike}
          >
            <FaThumbsUp /> {likeCount}
          </button>
          <button
            className={`btn ${disliked ? "btn-danger" : "btn-outline-danger"}`}
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
          commentInput={commentInput}
          setCommentInput={setCommentInput}
        />
      </div>
    </div>
  );
};

export default PostDetail;