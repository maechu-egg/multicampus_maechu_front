import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { formatDate } from '../../../utils/dateFormat';
import { commentApi } from 'services/api/community/commentApi';
import type { Comment } from '../../../hooks/community/useComment';



interface CommentItemProps {
  comment: Comment;
  onCommentDelete: (commentId: number, postId: number) => void;
  post_id: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onCommentDelete,
  post_id
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

  
  const handleCommentLike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!commentLiked) {
     
      try {

        console.log("token" , token);
        const response = await commentApi.commentLike(commentId, post_id, token);

        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_like_counts } = response.data;
  
          if (result) {
            setCommentLikeCount(comment_like_counts);
            setCommentLiked(true);
            
              if (commentDisliked) {
               
                setCommentDislikeCount(prev => prev - 1);
                await commentApi.commentDislikeDelete(commentId, post_id, token);
                setCommentDisliked(false);
           }
          } else if (Extable) {
            alert("이미 좋아요를 누른 상태입니다.");
          } else {
            alert("좋아요 추가 실패");
          }
        }
      } catch (error) {
        console.error("좋아요 요청 중 오류 발생:", error);
      }


     } else if (commentLiked) {
      // 좋아요 삭제 요청
      try {
        const response = await commentApi.commentLikeDelete(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_like_counts } = response.data;
  
          if (result) {
            setCommentLikeCount(comment_like_counts);
            setCommentLiked(false);
          } else if (Extable) {
            alert("이미 좋아요가 취소된 상태입니다.");
          } else {
            alert("좋아요 취소 실패");
          }
        }
      } catch (error) {
        console.error("좋아요 삭제 요청 중 오류 발생:", error);
      }
    }
  };

  const handleCommentDislike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }


    if (!commentDisliked) {
      // dislike 추가 요청
      try {
        const response = await commentApi.commentDislike(commentId, post_id, token);
        console.log(response.data);
        if (response.status === 200) {
          const { result, Extable, comment_dislike_counts } = response.data;

          if (result) {
            setCommentDislikeCount(comment_dislike_counts);
            setCommentDisliked(true);
            
            if(commentLiked){
              setCommentLikeCount(prev => prev - 1);
              await commentApi.commentLikeDelete(commentId, post_id, token);
              setCommentLiked(false);
            }
          } else if (Extable) {
            alert("이미 싫어요를 누른 상태입니다.");
          } else {
            alert("싫어요 추가 실패");
          }
        }
      } catch (error) {
        console.error("싫어요 요청 중 오류 발생:", error);
      }
    }  else if (commentDisliked) {
      // dislike 삭제 요청
      try {
        const response = await commentApi.commentDislikeDelete(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_dislike_counts } = response.data;

          if (result) {
            setCommentDisliked(false);
            setCommentDislikeCount(comment_dislike_counts);
          } else if (Extable) {
            alert("이미 싫어요가 취소된 상태입니다.");
          } else {
            alert("싫어요 취소 실패");
          }
        }
      } catch (error) {
        console.error("싫어요 삭제 요청 중 오류 발생:", error);
      }
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
          onClick={() =>  handleCommentLike(comment.id, post_id)}
        >
          <FaThumbsUp /> {CommentLikeCount}
        </button>
        <button
          className={`btn ${commentDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={() =>  handleCommentDislike(comment.id, post_id)}
        >
          <FaThumbsDown />  {CommentDislikeCount}
        </button>
      </div>
    </div>
  );
};

export default CommentItem;