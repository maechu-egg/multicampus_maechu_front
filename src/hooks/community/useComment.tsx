import {  useEffect, useState } from 'react';
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
  current_points: number;
  member_badge_level: string;
  member_id: number;
}

interface ServerComment {
  comments_id: number;
  c_nickname: string;
  comments_date: string;
  comments_contents: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  commentAuthor: boolean;
  comment_like_status: boolean;  
  comment_dislike_status: boolean; 
  current_points: number;
  member_id: number;
}

export const useComment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState(false); // 알림 모달 표시 여부 상태
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태

  const getComments = async (postId: number) => {
    console.log("getComment ! ");
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
  
      const response = await commentApi.getComments(postId, token);
      console.log("서버 응답 데이터:", response.data);
  
      if (response.status === 200) {
        const serverComments = response.data;
        const newComments: Comment[] = serverComments.map((serverComment: ServerComment) => {
          console.log('댓글 데이터 확인:', {
            comment_id: serverComment.comments_id,
            member_id: serverComment.member_id,
            current_points: serverComment.current_points,
            badge_level: getLevelLabel(serverComment.current_points)
          });
  
          return {
            id: serverComment.comments_id,
            postId: postId,
            author: serverComment.c_nickname ?? "Unknown",
            content: serverComment.comments_contents,
            date: serverComment.comments_date,
            comment_like_counts: serverComment.comment_like_counts ?? 0,
            comment_dislike_counts: serverComment.comment_dislike_counts ?? 0,
            commentAuthor: serverComment.commentAuthor,
            comment_like_status: serverComment.comment_like_status ?? false,
            comment_dislike_status: serverComment.comment_dislike_status ?? false,
            current_points: serverComment.current_points,
            member_badge_level: getLevelLabel(serverComment.current_points),  // 개인 포인트로만 레벨 계산
            member_id: serverComment.member_id,
          };
        });
  
        console.log("변환된 댓글 데이터:", newComments);
        setComments(newComments);
      }
    } catch (error: any) {
      console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
      if (error.response) {
        console.error("에러 응답:", error.response.data);
        console.error("에러 상태:", error.response.status);
      }
    }
  };

  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
  };

  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!content.trim()) {
      setAlertMessage("댓글을 입력하세요.");
      setShowAlertModal(true);
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
        getComments(postId);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
    }
  };
  
  const handleCommentDelete = async (commentId: number, postId: number) => {
  
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }
  
        const response = await commentApi.deleteComment(commentId, token);
  
        if (response.status === 200) {
         
          await getComments(postId);  // 댓글 목록 새로고침
        
          setAlertMessage("댓글이 삭제되었습니다.");
          setShowAlertModal(true);
       
        } else {
          setAlertMessage("댓글 삭제에 실패했습니다.");
          setShowAlertModal(true);
        }
      } catch (error) {
        console.error('서버와의 통신 중 오류 발생:', error);
        setAlertMessage("댓글 삭제 중 오류가 발생했습니다.");
        setShowAlertModal(true);
      }
    
  };
  const handleAlertClose = () => {
    setShowAlertModal(false);
  };



  return {
    comments,
    setComments,
    commentInput,
    setCommentInput,
    getComments,
    handleCommentSubmit,
    handleCommentDelete,
    showAlertModal,
    alertMessage,
    handleAlertClose,
  };
};