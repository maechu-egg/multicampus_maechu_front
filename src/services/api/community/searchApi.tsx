import api from "../axios";
import { Post } from "../../../hooks/community/usePost";

interface SearchResponse {
  posts: Post[];
  totalPages: number;
}

interface KeywordSearchResponse {
  searchList: Post[];
  totalPages: number;
}

export const searchApi = {
  // 검색어로 검색
  searchPosts: async (
    searchTerm: string,
    page: number,
    size: number,
    token: string
  ) => {
    return await api.get<SearchResponse>(
      `/community/posts/search/${searchTerm}`,
      {
        params: {
          page,
          size,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // 키워드로 검색
  searchByKeyword: async (
    keyword: string,
    page: number,
    size: number,
    post_up_sport: string,
    token: string
  ) => {
    return await api.get<KeywordSearchResponse>(
      `/community/posts/sport/${keyword}`,
      {
        params: {
          page,
          size,
          post_up_sport,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
