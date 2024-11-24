import { Post } from "../../../hooks/community/usePost";
import api from "../axios";

export const paginationApi = {
  getPostsByPage: async (
    params: {
      page: number;
      size: number;
      post_up_sport?: string;
      post_sport?: string;
    },
    token: string
  ) => {
    return await api.get(`/community/posts`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getSearchResultsByPage: async (
    params: {
      searchTerm: string;
      page: number;
      size: number;
    },
    token: string
  ) => {
    return await api.get(`/community/posts/search/${params.searchTerm}`, {
      params: {
        page: params.page,
        size: params.size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getKeywordSearchResultsByPage: async (
    params: {
      keyword: string;
      category: string;
      page: number;
      size: number;
    },
    token: string
  ) => {
    return await api.get(`/community/posts/sport/${params.keyword}`, {
      params: {
        page: params.page,
        size: params.size,
        post_up_sport: params.category,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
