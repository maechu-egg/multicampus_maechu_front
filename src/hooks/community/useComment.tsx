import { useState } from 'react';
import { commentApi } from '../../services/api/community/commentApi';

export interface Comment {
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

interface ServerComment {
  comments_id: number;
  c_nickname: string;
  comments_date: string;
  comments_contents: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  commentAuthor: boolean;
}

export const useComment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");

  const getComments = async (postId: number) => {
    console.log("getComment ! ");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const currentUserId = parseInt(localStorage.getItem("memberId") || "0");
      if (!currentUserId) {
        alert("사용자 정보를 가져올 수 없습니다.");
        return;
      }

      const response = await commentApi.getComments(postId, token);
      console.log("response data", response.data);
      const serverComment = response.data;
      console.log("serverComment", serverComment);

      const newComment: Comment[] = serverComment.map((serverComment: ServerComment) => {
        return {
          id: serverComment.comments_id,
          postId: postId,
          author: serverComment.c_nickname ?? "Unknown",
          content: serverComment.comments_contents,
          date: serverComment.comments_date,
          comment_like_counts: serverComment.comment_like_counts ?? 0,
          comment_dislike_counts: serverComment.comment_dislike_counts ?? 0,
          commentAuthor: serverComment.commentAuthor,
          comment_like_status: false,
          comment_dislike_status: false,
        };
      });
      console.log("newComment", newComment);
      setComments(newComment);
    } catch (error) {
      console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!content.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const commentData = {
        comments_contents: content,
        post_id: postId,
      };

      const response = await commentApi.saveComment(commentData, token);

      if (response.status === 201) {
        setCommentInput("");
        alert(response.data.message);
        getComments(postId);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
    }
  };

  const handleCommentDelete = async (commentId: number, postId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await commentApi.deleteComment(commentId, token);

        if (response.status === 200) {
          getComments(postId);
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('서버와의 통신 중 오류 발생:', error);
      }
    }
  };

  const handleCommentLike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    const targetComment = comments.find(comment => comment.id === commentId);

    if (targetComment && !targetComment.comment_like_status) {
      try {
        const response = await commentApi.commentLike(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_like_count } = response.data;

          if (result) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId
                ? {
                  ...comment,
                  comment_like_counts: comment_like_count || comment.comment_like_counts,
                  comment_like_status: true
                }
                : comment
            );
            setComments(updatedComments);
            alert("좋아요 추가 성공");
          } else if (Extable) {
            alert("테이블에 이미 있습니다.");
          } else {
            alert("좋아요 추가 실패");
          }
        }
      } catch (error) {
        console.error("좋아요 요청 중 오류 발생:", error);
        alert("서버 오류로 좋아요 요청이 실패했습니다.");
      }
    } else if (targetComment && targetComment.comment_like_status) {
      try {
        const response = await commentApi.commentLikeDelete(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_like_count } = response.data;

          if (result) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId
                ? {
                  ...comment,
                  comment_like_counts: comment_like_count || comment.comment_like_counts,
                  comment_like_status: false
                }
                : comment
            );
            setComments(updatedComments);
            alert("좋아요 삭제 성공");
          } else if (Extable) {
            alert("좋아요가 이미 취소된 상태입니다.");
          } else {
            alert("좋아요 취소 실패");
          }
        }
      } catch (error) {
        console.error("좋아요 삭제 요청 중 오류 발생:", error);
        alert("서버 오류로 좋아요 삭제 요청이 실패했습니다.");
      }
    }
  };

  const handleCommentDislike = async (commentId: number, post_id: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    const targetComment = comments.find(comment => comment.id === commentId);

    if (targetComment && !targetComment.comment_dislike_status) {
      try {
        const response = await commentApi.commentDislike(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_dislike_count } = response.data;

          if (result) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId
                ? {
                  ...comment,
                  comment_dislike_counts: comment_dislike_count || comment.comment_dislike_counts,
                  comment_dislike_status: true
                }
                : comment
            );
            setComments(updatedComments);
            alert("싫어요 추가 성공");
          } else if (Extable) {
            alert("테이블에 이미 있습니다.");
          } else {
            alert("싫어요 추가 실패");
          }
        }
      } catch (error) {
        console.error("싫어요 요청 중 오류 발생:", error);
        alert("서버 오류로 싫어요 요청이 실패했습니다.");
      }
    } else if (targetComment && targetComment.comment_dislike_status) {
      try {
        const response = await commentApi.commentDislikeDelete(commentId, post_id, token);

        if (response.status === 200) {
          const { result, Extable, comment_dislike_count } = response.data;

          if (result) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId
                ? {
                  ...comment,
                  comment_dislike_counts: comment_dislike_count || comment.comment_dislike_counts,
                  comment_dislike_status: false
                }
                : comment
            );
            setComments(updatedComments);
            alert("싫어요 삭제 성공");
          } else if (Extable) {
            alert("싫어요가 이미 취소된 상태입니다.");
          } else {
            alert("싫어요 취소 실패");
          }
        }
      } catch (error) {
        console.error("싫어요 삭제 요청 중 오류 발생:", error);
        alert("서버 오류로 싫어요 삭제 요청이 실패했습니다.");
      }
    }
  };

  return {
    comments,
    setComments,
    commentInput,
    setCommentInput,
    getComments,
    handleCommentSubmit,
    handleCommentDelete,
    handleCommentLike,
    handleCommentDislike,
  };
};