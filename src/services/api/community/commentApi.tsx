import api from "../axios";

export const commentApi = {
  // 댓글 목록 조회
  getComments: async (postId: number, token: string) => {
    try {
      // 원래 경로로 수정
      const response = await api.get(`/community/comment/getComment/${postId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      // 각 댓글 작성자의 프로필 정보 가져오기
      if (response.data && response.data.length > 0) {
        const commentsWithProfile = await Promise.all(
          response.data.map(async (comment: any) => {
            try {
              const profileResponse = await api.get(`/community/posts/showprofile`, {
                params: {
                  member_id: comment.member_id,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // 프로필 정보와 댓글 정보 합치기
              return {
                ...comment,
                current_points: profileResponse.data.current_points,
              };
            } catch (error) {
              console.error(`프로필 정보 가져오기 실패 (member_id: ${comment.member_id}):`, error);
              return comment;
            }
          })
        );

        return {
          ...response,
          data: commentsWithProfile,
        };
      }

      return response;
    } catch (error) {
      console.error("Error in getComments:", error);
      throw error;
    }
  },

  // 댓글 작성
  saveComment: async (
    commentData: { comments_contents: string; post_id: number },
    token: string
  ) => {
    return await api.post(`/community/comment/saveComment`, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // 댓글 삭제
  deleteComment: async (commentId: number, token: string) => {
    return await api.delete(`/community/comment/delete/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 댓글 좋아요
  commentLike: async (commentId: number, post_id: number, token: string) => {
    return await api.post(
      `/community/comment/${commentId}/commentlikeinsert`,
      null,
      {
        params: { post_id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // 댓글 좋아요 취소
  commentLikeDelete: async (
    commentId: number,
    post_id: number,
    token: string
  ) => {
    return await api.delete(
      `/community/comment/${commentId}/commentlikedelete`,
      {
        params: { post_id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // 댓글 싫어요
  commentDislike: async (commentId: number, post_id: number, token: string) => {
    return await api.post(
      `/community/comment/${commentId}/commentdislikeinsert`,
      null,
      {
        params: { post_id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // 댓글 싫어요 취소
  commentDislikeDelete: async (
    commentId: number,
    post_id: number,
    token: string
  ) => {
    return await api.delete(
      `/community/comment/${commentId}/commentdislikedelete`,
      {
        params: { post_id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};
