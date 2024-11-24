import api from "../axios";

export const categoryApi = {
  // 카테고리별 게시글 조회
  getCategoryPosts: async (
    params: {
      post_up_sport: string;
      page: number;
      size: number;
    },
    token: string
  ) => {
    return await api.get(`/community/posts`, {
      params: {
        page: params.page,
        size: params.size,
        post_up_sport: params.post_up_sport,
        post_sport: undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 서브카테고리별 게시글 조회
  getSubcategoryPosts: async (
    params: {
      post_up_sport: string;
      post_sport: string;
      page: number;
      size: number;
    },
    token: string
  ) => {
    return await api.get(`/community/posts`, {
      params: {
        page: params.page,
        size: params.size,
        post_up_sport: params.post_up_sport,
        post_sport: params.post_sport,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
