import axios from 'axios';

const BASE_URL = 'http://localhost:8001';

interface PostParams {
  page: number;
  size: number;
  post_up_sport?: string;
  post_sport?: string;
}

const processImageUrls = (post: any) => {
  return {
    ...post,
    post_img1: post.post_img1 ? `${BASE_URL}/static/${post.post_img1}?t=${new Date().getTime()}` : null,
    post_img2: post.post_img2 ? `${BASE_URL}/static/${post.post_img2}?t=${new Date().getTime()}` : null,
  };
};


export const postApi = {
  // 게시글 목록 조회
  getPosts: async (params: PostParams, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/community/posts`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // 응답 데이터 구조에 따라 처리
      if (response.data.posts) {
        const processedPosts = response.data.posts.map((post: any) => {
          // 이미지 파일명이 있는 경우에만 URL 생성
          const hasImage1 = post.post_img1 && post.post_img1.trim() !== '';
          const hasImage2 = post.post_img2 && post.post_img2.trim() !== '';
          
          return {
            ...post,
            post_img1: hasImage1 ? `${BASE_URL}/static/${post.post_img1}` : null,
            post_img2: hasImage2 ? `${BASE_URL}/static/${post.post_img2}` : null,
          };
        });
        response.data.posts = processedPosts;
      }
      
      return response;
    } catch (error) {
      console.error("Error in getPosts:", error);
      throw error;
    }
  },

  // 추천 게시글 조회
  getRecommendedPosts: async (params: { post_up_sport: string, post_sport?: string }, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/community/posts/userRC`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        response.data = response.data.map(processImageUrls);
      }
      
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
    // FormData 내용 확인용 로그
    for (let pair of formData.entries()) {
      console.log('FormData content:', pair[0], pair[1]);
    }

    const response = await axios.post(
      `${BASE_URL}/community/posts/effortpost`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",  // multipart/form-data 유지
          Authorization: `Bearer ${token}`,
        },
      }
    );

    response.data = processImageUrls(response.data);
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    if (axios.isAxiosError(error)) {
      console.log('Error response:', error.response?.data);
      console.log('Error status:', error.response?.status);
    }
    throw error;
  }
},

  // 게시글 수정
  updatePost: async (postId: number, formData: FormData, token: string) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/community/posts/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response.data = processImageUrls(response.data);
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
      `${BASE_URL}/community/posts/${postId}/delete`,  // 엔드포인트 수정
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
        `${BASE_URL}/community/posts/${postId}/detail`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { isRecommended }
        }
      );

      response.data = processImageUrls(response.data);
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
        `${BASE_URL}/community/posts/search`,
        {
          params: { searchTerm },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        response.data = response.data.map(processImageUrls);
      }

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
        `${BASE_URL}/community/posts/keyword`,
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

      if (response.data) {
        response.data = response.data.map(processImageUrls);
      }

      return response;
    } catch (error) {
      console.error('Error searching posts by keyword:', error);
      throw error;
    }
  },

  // 좋아요 추가
  addLike: async (postId: number, token: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/useractivity/${postId}/likeinsert`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  },

  // 좋아요 삭제
  deleteLike: async (postId: number, token: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/useractivity/${postId}/likedelete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      console.error('Error deleting like:', error);
      throw error;
    }
  },

  // 싫어요 추가
  addDislike: async (postId: number, token: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/useractivity/${postId}/unlikeinsert`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding dislike:', error);
      throw error;
    }
  },

  // 싫어요 삭제
  deleteDislike: async (postId: number, token: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/useractivity/${postId}/unlikedelete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      console.error('Error deleting dislike:', error);
      throw error;
    }
  }
};