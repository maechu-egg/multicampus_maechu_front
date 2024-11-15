import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { formatDate } from '../../../utils/dateFormat';
import axios from 'axios';

interface CommentProps {
  comment: {
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
  };
  onCommentDelete: (commentId: number, postId: number) => void;
  post_id: number;
  
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onCommentDelete,
  post_id, 

}) => {
  
  const [commentLiked, setCommentLiked] = useState( comment.comment_like_status );
  const [commentDisliked, setCommentDisliked] = useState(comment.comment_dislike_status);
  const [CommentLikeCount, setCommentLikeCount] = useState(comment.comment_like_counts);
  const [CommentDislikeCount, setCommentDislikeCount] = useState(comment.comment_dislike_counts);
 
  useEffect(() => {
    setCommentLiked( comment.comment_like_status );
    setCommentDisliked(comment.comment_dislike_status);
    setCommentLikeCount(comment.comment_like_counts);
    setCommentDislikeCount(comment.comment_dislike_counts);
  }, [ comment.comment_like_status , comment.comment_dislike_status, comment.comment_like_counts, comment.comment_dislike_counts]);

  // 댓글 like
  const handleCommentLike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }
    if (!commentLiked) {
     
      try {

        console.log("token" , token);
        const response = await axios.post(`http://localhost:8001/community/comment/${commentId}/commentlikeinsert`,
          {}, 
          {
            params: { post_id: post_id },  
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_like_counts } = response.data;
  
          if (result) {
            setCommentLikeCount(comment_like_counts);
            setCommentLiked(true);
            
              if (commentDisliked) {
               
                setCommentDislikeCount(prev => prev - 1);
               await axios.delete(
                    `http://localhost:8001/community/comment/${commentId}/commentdislikedelete`,
                    {
                      params: { post_id: post_id },
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setCommentDisliked(false);
             }

          } else if (Extable) {
            alert("테이블에 이미 있습니다.");
          } else {
            alert("좋아요 추가 실패");
          }
        } else if (response.status === 400) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("좋아요 요청 중 오류 발생:", error);
        alert("서버 오류로 좋아요 요청이 실패했습니다.");
      }
    } else if (commentLiked) {
      // 좋아요 삭제 요청
      try {
        const response = await axios.delete(
          `http://localhost:8001/community/comment/${commentId}/commentlikedelete`,
          {
            params: { post_id: post_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_like_counts } = response.data;
  
          if (result) {
            setCommentLikeCount(comment_like_counts);
            setCommentLiked(false);
           
          } else if (Extable) {
            alert("좋아요가 이미 취소된 상태입니다.");
          } else {
            alert("좋아요 취소 실패");
          }
        } else if (response.status === 400) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("좋아요 삭제 요청 중 오류 발생:", error);
        alert("서버 오류로 좋아요 삭제 요청이 실패했습니다.");
      }
    } else {
      alert("이미 좋아요를 누른 댓글입니다.");
    }
  };
  
  
  // 댓글 dislike
  const handleCommentDisLike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    if (!commentDisliked) {
      // dislike 추가 요청
      try {
        const response = await axios.post(
          `http://localhost:8001/community/comment/${commentId}/commentdislikeinsert`,null,
          {
            params: { post_id: post_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_dislike_counts } = response.data;
  
          if (result) {
            setCommentDislikeCount(comment_dislike_counts);
            setCommentDisliked(true);
            
            if(commentLiked){
              setCommentLikeCount(prev => prev - 1);
               await axios.delete(  `http://localhost:8001/community/comment/${commentId}/commentlikedelete`,
                {
                  params: { post_id: post_id },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setCommentLiked(false);
            }
          } else if (Extable) {
            alert("테이블에 이미 있습니다.");
          } else {
            alert("dislike 추가 실패");
          }
        } else if (response.status === 400) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("dislike 요청 중 오류 발생:", error);
        alert("서버 오류로 dislike 요청이 실패했습니다.");
      }
    } else if (commentDisliked) {
      // dislike 삭제 요청
      try {
        const response = await axios.delete(
          `http://localhost:8001/community/comment/${commentId}/commentdislikedelete`,
          {
            params: { post_id: post_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_dislike_counts } = response.data;
  
          if (result) {
            setCommentDisliked(false);
            setCommentDislikeCount(comment_dislike_counts);
          } else if (Extable) {
            alert("dislike가 이미 취소된 상태입니다.");
          } else {
            alert("dislike 취소 실패");
          }
        } else if (response.status === 400) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("dislike 삭제 요청 중 오류 발생:", error);
        alert("서버 오류로 dislike 삭제 요청이 실패했습니다.");
      }
    } else {
      alert("이미 dislike를 누른 댓글입니다.");
    }
  };


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
          className={`btn ${commentLiked ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => handleCommentLike(comment.id, post_id)}
        >
          <FaThumbsUp /> {CommentLikeCount}
        </button>
        <button
          className={`btn ${commentDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={() => handleCommentDisLike(comment.id, post_id)}
        >
          <FaThumbsDown /> {CommentDislikeCount}
        </button>

      </div>
    </div>
  );
};

export default Comment;
