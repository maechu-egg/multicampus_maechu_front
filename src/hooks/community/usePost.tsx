import { useState } from 'react';
import { postApi } from '../../services/api/community/postApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
export interface Post {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments: Comment[];
  comments_count: number;
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword: string;
  post_hashtag: string;
  post_like_counts: number;
  isRecommended?: boolean;
  likeStatus: boolean;
  unlikeStatus: boolean;
  post_img1: string;
  post_img2: string;
  post_unlike_counts: number;
  member_id: number;
  author: boolean;
}

export const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isAuthor, setIsAuthor] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // 게시글 목록 조회
const fetchPosts = async (
  selectedCategory?: string,
  selectedSubcategory?: string,
  page: number = 1,
  size: number = 10
) => {
  console.log("Fetching posts...");
  setLoading(true);
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    const response = await postApi.getPosts({
      page,
      size,
      post_up_sport: selectedCategory,
      post_sport: selectedSubcategory,
    }, token);

    console.log("Server response:", response.data); // 서버 응답 로깅

    const fetchedPosts = response.data.posts || response.data;
    setTotalPages(response.data.totalPages);
    console.log("Total pages:", response.data.totalPages); // totalPages 값 로깅

    const mappedPosts = fetchedPosts.map((post: Post) => ({
      post_id: post.post_id,
      post_title: post.post_title,
      post_contents: post.post_contents || '',
      post_nickname: post.post_nickname,
      post_date: post.post_date,
      post_views: post.post_views,
      comments: post.comments || [],
      comments_count: post.comments_count || 0,
      post_up_sport: post.post_up_sport || '',
      post_sport: post.post_sport,
      post_sports_keyword: post.post_sports_keyword,
      post_hashtag: post.post_hashtag || '',
      post_like_counts: post.post_like_counts,
      isRecommended: post.isRecommended || false,
      likeStatus: post.likeStatus,
      unlikeStatus: post.unlikeStatus,
      post_img1: post.post_img1,
      post_img2: post.post_img2,
      post_unlike_counts: post.post_unlike_counts,
      member_id: post.member_id,
      author: post.author
    }));
    setPosts(mappedPosts);
  } catch (error) {
    console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
  } finally {
    setLoading(false);
  }
};

  // 추천 게시글 조회
  const fetchRecommendedPosts = async (
    selectedCategory?: string,
    selectedSubcategory?: string
  ) => {
    setLoading(true);
    setRecommendedPosts([]);
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    if (selectedCategory && (!selectedSubcategory || selectedSubcategory === "")) {
      try {
        const response = await postApi.getRecommendedPosts({
          post_up_sport: selectedCategory,
          post_sport: undefined,
        }, token);

        setRecommendedPosts(response.data);
      } catch (error) {
        console.error('추천 게시글 불러오기 오류:', error);
      }
    }
  };

// 게시글 상세 조회
const handlePostClick = async (post: Post, isRecommended: boolean) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const response = await postApi.getPostDetail(post.post_id, isRecommended, token);
    setSelectedPost(response.data);
    setIsAuthor(response.data.Author);
    setLiked(response.data.likeStatus);
    setDisliked(response.data.unlikeStatus);
    setLikeCount(response.data.post_like_counts);
    setDislikeCount(response.data.post_unlike_counts);
  } catch (error) {
    console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
  }
};

  // 게시글 작성
  const handleSavePost = async (
    post_title: string,
    post_contents: string,
    post_up_sport: string,
    post_sport: string,
    post_sports_keyword: string,
    post_hashtag: string,
    imageFiles: File[] | null
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return false;
      }
  
      const formData = new FormData();
      formData.append("post_title", post_title);
      formData.append("post_contents", post_contents);
      formData.append("post_up_sport", post_up_sport);
      formData.append("post_sport", post_sport);
      formData.append("post_sports_keyword", post_sports_keyword);
      formData.append("post_hashtag", post_hashtag);
  
      // 이미지 파일 처리 - 백엔드의 @RequestParam 이름과 일치시킴
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          if (index < 2) {
            formData.append("images", file);  // "post_img1", "post_img2" 대신 "images"로 변경
            console.log(`이미지 ${index + 1} 추가:`, file.name);
          }
        });
      }
  
      console.log("=== 전송 데이터 ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
  
      const response = await postApi.createPost(formData, token);
  
      if (response.status === 200) {
        alert("게시글이 성공적으로 저장되었습니다.");
        await fetchPosts();
        navigate('/communitypage');
        return true;
      }
  
      return false;
    } catch (error: any) {
      console.error("게시글 저장 중 오류:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(error.message || "게시글 저장에 실패했습니다.");
      return false;
    }
  };

  // 게시글 수정
  const handleUpdatePost = async (
    postId: number,
    post_title: string,
    post_contents: string,
    post_up_sport: string,
    post_sport: string,
    post_sports_keyword: string,
    post_hashtag: string,
    imageFiles: File[] | null
  ) => {
    const formData = new FormData();
    formData.append("post_title", post_title);
    formData.append("post_contents", post_contents);
    formData.append("post_up_sport", post_up_sport);
    formData.append("post_sport", post_sport);
    formData.append("post_hashtag", post_hashtag);
    formData.append("post_sports_keyword", post_sports_keyword);

    if (imageFiles) {
      for (let i = 0; i < Math.min(imageFiles.length, 2); i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return false;
      }

      const response = await postApi.updatePost(postId, formData, token);

      if (response.status >= 200 && response.status < 300) {
        const updatedPost = response.data;
        setPosts((posts) =>
          posts.map((post) =>
            post.post_id === postId ? updatedPost : post
          )
        );
        setSelectedPost(updatedPost);
        alert("게시글이 수정되었습니다.");
        navigate('/communitypage');
        return true;
      } else {
        console.error('게시글을 수정할 수 없습니다.');
        navigate('/communitypage');
        return false;
      }
    } catch (error) {
      console.error('서버와의 통신 중 오류가 발생했습니다.:', error);
      navigate('/communitypage');
      return false;
    }
  };

  // 게시글 삭제
  const handleDelete = async (postId: number) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        const response = await postApi.deletePost(postId, token);

        if (response.status === 200) {
          setPosts(posts.filter(post => post.post_id !== postId));
          alert(response.data);
          setSelectedPost(null);
          navigate('/communitypage');
          return true;
        } else {
          alert(response.data);
          navigate('/communitypage');
          return false;
        }
      } catch (error) {
        console.error('서버와의 통신 중 오류가 발생했습니다.:', error);
        return false;
      }
    }
    return false;
  };
  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      let response;
      if (!liked) {
        response = await axios.post(
          `http://localhost:8001/useractivity/${postId}/likeinsert`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 좋아요를 눌렀습니다.");
          } else if (response.data.result) {
            setLikeCount(response.data.likeCount);
            setLiked(true);
            if (disliked) {
              setDislikeCount((prev) => prev - 1);
              await axios.delete(
                `http://localhost:8001/useractivity/${postId}/unlikedelete`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setDisliked(false);
            }
          }
        }
      } else {
        response = await axios.delete(
          `http://localhost:8001/useractivity/${postId}/likedelete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.result) {
            setLikeCount(response.data.likeCount);
            setLiked(false);
          }
        }
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
    }
  };

  // 싫어요 처리
  const handleDislike = async (postId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      let response;
      if (!disliked) {
        response = await axios.post(
          `http://localhost:8001/useractivity/${postId}/unlikeinsert`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 싫어요를 눌렀습니다.");
          } else if (response.data.result) {
            setDislikeCount(response.data.unLikeCount);
            setDisliked(true);
            if (liked) {
              setLikeCount((prev) => prev - 1);
              await axios.delete(
                `http://localhost:8001/useractivity/${postId}/likedelete`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setLiked(false);
            }
          }
        }
      } else {
        response = await axios.delete(
          `http://localhost:8001/useractivity/${postId}/unlikedelete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.result) {
            setDislikeCount(response.data.unLikeCount);
            setDisliked(false);
          }
        }
      }
    } catch (error) {
      console.error("싫어요 처리 중 오류:", error);
    }
  };
  // 정렬 순서 변경
  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };
  return {
    posts,
    setPosts,
    recommendedPosts,
    setRecommendedPosts,
    selectedPost,
    setSelectedPost,
    loading,
    totalPages,
    isAuthor,
    liked,
    disliked,
    likeCount,
    dislikeCount,
    sortOrder,
    fetchPosts,
    fetchRecommendedPosts,
    handlePostClick,
    handleSavePost,
    handleUpdatePost,
    handleDelete,
    handleLike,
    handleDislike,
    handleSortOrderChange,
  };
};