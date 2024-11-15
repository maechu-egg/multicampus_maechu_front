import axios from 'axios';

interface PostParams {
  page: number;
  size: number;
  post_up_sport?: string;
  post_sport?: string;
}

export const postApi = {
  // 게시글 목록 조회
  getPosts: async (params: PostParams, token: string) => {
    console.log("Requesting posts with params:", params);
    try {
      const response = await axios.get("http://localhost:8001/community/posts", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Full API response:", response);
      console.log("Posts data:", response.data);
      console.log("Total pages:", response.data.totalPages);
      return response;
    } catch (error) {
      console.error("Error in getPosts:", error);
      throw error;
    }
  },

  // 추천 게시글 조회
  getRecommendedPosts: async (params: { post_up_sport: string, post_sport?: string }, token: string) => {
    try {
      const response = await axios.get('http://localhost:8001/community/posts/userRC', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Recommended posts response:", response.data);
      return response;
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
      throw error;
    }
  },

  // 게시글 작성
  createPost: async (formData: FormData, token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/community/posts/effortpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // 게시글 수정
  updatePost: async (postId: number, formData: FormData, token: string) => {
    try {
      const response = await axios.put(
        `http://localhost:8001/community/posts/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // 게시글 삭제
  deletePost: async (postId: number, token: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8001/community/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // 게시글 상세 조회
  getPostDetail: async (postId: number, isRecommended: boolean, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/community/posts/${postId}/detail`,
        {
          params: {
            isRecommended: isRecommended
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching post detail:', error);
      throw error;
    }
  },

  // 게시글 검색
  searchPosts: async (searchTerm: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/community/posts/search`,
        {
          params: { searchTerm },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // 키워드로 게시글 검색
  searchPostsByKeyword: async (keyword: string, category: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/community/posts/keyword`,
        {
          params: { 
            keyword,
            category 
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error searching posts by keyword:', error);
      throw error;
    }
  }
};