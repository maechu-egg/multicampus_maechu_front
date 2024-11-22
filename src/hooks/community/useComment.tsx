import {  useState } from 'react';
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
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
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
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
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
  
      const response = await commentApi.getComments(postId, token);
      console.log("서버 응답 데이터:", response.data);
  
      if (response.status === 200) {
        const serverComments = response.data;
        const newComments: Comment[] = serverComments.map((serverComment: ServerComment) => ({
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
          current_points : serverComment.current_points,
          crew_current_points:serverComment.crew_current_points,
          member_badge_level: getLevelLabel(serverComment.current_points),
          crew_badge_level :  getLevelLabel(serverComment.crew_current_points),
          crew_battle_wins : serverComment.crew_battle_wins,
        }));
  
        console.log("변환된 댓글 데이터:", newComments);
        setComments(newComments);
      }
    } catch (error: any) { // error 타입을 any로 명시
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
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }
  
        const response = await commentApi.deleteComment(commentId, token);
  
        if (response.status === 200) {
          await getComments(postId);  // 댓글 목록 새로고침
          alert("댓글이 삭제되었습니다.");
        } else {
          alert("댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error('서버와의 통신 중 오류 발생:', error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
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
  };
};