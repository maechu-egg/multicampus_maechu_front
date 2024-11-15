import axios from 'axios';

const BASE_URL = 'http://localhost:8001/community/comment';

export const commentApi = {
  // 댓글 목록 조회
  getComments: async (postId: number, token: string) => {
    return await axios.get(`${BASE_URL}/getComment/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // 댓글 작성
  saveComment: async (commentData: { comments_contents: string; post_id: number }, token: string) => {
    return await axios.post(`${BASE_URL}/saveComment`, commentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // 댓글 삭제
  deleteComment: async (commentId: number, token: string) => {
    return await axios.delete(`${BASE_URL}/delete/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // 댓글 좋아요
  commentLike: async (commentId: number, post_id: number, token: string) => {
    return await axios.post(`${BASE_URL}/${commentId}/commentlikeinsert`, null, {
      params: { post_id },
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // 댓글 좋아요 취소
  commentLikeDelete: async (commentId: number, post_id: number, token: string) => {
    return await axios.delete(`${BASE_URL}/${commentId}/commentlikedelete`, {
      params: { post_id },
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // 댓글 싫어요
  commentDislike: async (commentId: number, post_id: number, token: string) => {
    return await axios.post(`${BASE_URL}/${commentId}/commentdislikeinsert`, null, {
      params: { post_id },
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // 댓글 싫어요 취소
  commentDislikeDelete: async (commentId: number, post_id: number, token: string) => {
    return await axios.delete(`${BASE_URL}/${commentId}/commentdislikedelete`, {
      params: { post_id },
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};