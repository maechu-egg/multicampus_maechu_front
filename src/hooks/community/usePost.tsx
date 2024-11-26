import { useState } from 'react';
import { postApi } from '../../services/api/community/postApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext import 추가
import { useComment } from './useComment';
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
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
}

export const usePost = () => {
  const { state: { token } } = useAuth(); // AuthContext 사용
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const { getComments } = useComment();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

 // 게시글 목록 조회
 const fetchPosts = async (
  selectedCategory?: string,
  selectedSubcategory?: string,
  page: number = 1,
  size: number = 10
) => {

  console.log("Fetching posts...");
  setLoading(true);
  setCurrentPage(1);
  
  
  try {
    if (!token) {
      console.error("로그인이 필요합니다.");
      return;
    }

      const response = await postApi.getPosts(
        {
          page,
          size,
          post_up_sport: selectedCategory,
          post_sport: selectedSubcategory,
        },
        token
      );

    console.log("Server response:", response.data);

    const fetchedPosts = response.data.posts || response.data;
    setTotalPages(response.data.totalPages);
    console.log(" fetchPosts  Total page:", response.data.totalpage);
    console.log(" fetchPosts  Total pages:", response.data.totalPages);

      const mappedPosts = fetchedPosts.map((post: Post) => ({
        post_id: post.post_id,
        post_title: post.post_title,
        post_contents: post.post_contents || "",
        post_nickname: post.post_nickname,
        post_date: post.post_date,
        post_views: post.post_views,
        comments: post.comments || [],
        comments_count: post.comments_count || 0,
        post_up_sport: post.post_up_sport || "",
        post_sport: post.post_sport,
        post_sports_keyword: post.post_sports_keyword,
        post_hashtag: post.post_hashtag || "",
        post_like_counts: post.post_like_counts,
        isRecommended: post.isRecommended || false,
        likeStatus: post.likeStatus,
        unlikeStatus: post.unlikeStatus,
        post_img1: post.post_img1,
        post_img2: post.post_img2,
        post_unlike_counts: post.post_unlike_counts,
        member_id: post.member_id,
        author: post.author,
        current_points : post.current_points,
        crew_current_points:post.crew_current_points,
        member_badge_level: getLevelLabel(post.current_points),
        crew_badge_level :  getLevelLabel(post.crew_current_points),
        crew_battle_wins : post.crew_battle_wins,
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

    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    if (
      selectedCategory &&
      (!selectedSubcategory || selectedSubcategory === "")
    ) {
      try {
        const response = await postApi.getRecommendedPosts(
          {
            post_up_sport: selectedCategory,
            post_sport: undefined,
          },
          token
        );

        setRecommendedPosts(response.data);
      } catch (error) {
        console.error("추천 게시글 불러오기 오류:", error);
      }
    }
  };

  // 게시글 상세 조회
  const handlePostClick = async (post: Post, isRecommended: boolean) => {
    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
  
      const response = await postApi.getPostDetail(post.post_id, isRecommended, token);
      setSelectedPost(response.data);
      setIsAuthor(response.data.Author);
      getComments(post.post_id);  // 댓글 가져오기 추가
       // 페이지 상단으로 스크롤
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
      if (!token) {
        alert("로그인이 필요합니다.");
        return false;
      }

      const response = await postApi.createPost(formData, token);
 
      if (response.status >= 200 && response.status < 300) {
        setModalMessage("게시글이 작성되었습니다.");
        setIsModalOpen(true);
       
        
      } else {
        setModalMessage('게시글을 작성할 수 없습니다.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMessage("");

      navigate("/communitypage"); 
  
  };

  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
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
    imageFiles: File[] | null,
    existingImages : string[],
  ) => {
    const formData = new FormData();
    formData.append("post_title", post_title);
    formData.append("post_contents", post_contents);
    formData.append("post_up_sport", post_up_sport);
    formData.append("post_sport", post_sport);
    formData.append("post_hashtag", post_hashtag);
    formData.append("post_sports_keyword", post_sports_keyword);
   
    if (existingImages.length > 0) {
      formData.append("existing_images", existingImages[0]); // 기존 이미지 파일 이름 전송
    }

    if (imageFiles) {
      for (let i = 0; i < Math.min(imageFiles.length, 2); i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return false;
      }

      const response = await postApi.updatePost(postId, formData, token);

      if (response.status >= 200 && response.status < 300) {
        const updatedPost = response.data;
        setPosts((posts) =>
          posts.map((post) => (post.post_id === postId ? updatedPost : post))
        );
        setSelectedPost(updatedPost);
        setModalMessage("게시글이 수정되었습니다.");
        setIsModalOpen(true);
        return true;
      } else {
        setModalMessage("게시글을 수정할 수 없습니다.");
        setIsModalOpen(true);
        return false;
      }
    } catch (error) {
      console.error("서버와의 통신 중 오류가 발생했습니다.:", error);
      setModalMessage("서버와의 통신 중 오류가 발생했습니다.:");
      setIsModalOpen(true);
      return false;
    }
  };

 // 게시글 삭제
// 게시글 삭제
const handleDelete = async (postId: number) => {
  try {
    if (!token) {
      alert("로그인이 필요합니다.");
      return false;
    }
    setIsConfirmModalOpen(false);
    console.log('Current token:', token); // 토큰 확인용 로그

    // if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    //   return false;
    // }

    const response = await postApi.deletePost(postId, token);
 
    if (response.status === 200) {
      setModalMessage('게시글이 삭제되었습니다.');
      setIsModalOpen(true);   
    } else {
      setModalMessage('게시글 삭제에 실패했습니다.');
      setIsModalOpen(true);
    }
  } catch (error) {
    console.error('게시글 삭제 중 오류 발생:', error);
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      setModalMessage("게시글 삭제 권한이 없습니다.");
    } else {
      setModalMessage("게시글 삭제 중 오류가 발생했습니다.");
    }
    setIsModalOpen(true);
  }
};

   // 좋아요 처리
   const handleLike = async (postId: number) => {
    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!liked) {
        const response = await postApi.addLike(postId, token);
        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 좋아요를 눌렀습니다.");
          } else if (response.data.result) {
            setLikeCount(response.data.likeCount);
            setLiked(true);
            if (disliked) {
              setDislikeCount((prev) => prev - 1);
              await postApi.deleteDislike(postId, token);
              setDisliked(false);
            }
          }
        }
      } else {
        const response = await postApi.deleteLike(postId, token);
        if (response.status === 200 && response.data.result) {
          setLikeCount(response.data.likeCount);
          setLiked(false);
        }
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  // 싫어요 처리
  const handleDislike = async (postId: number) => {
    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!disliked) {
        const response = await postApi.addDislike(postId, token);
        if (response.status === 200) {
          if (response.data.Extable) {
            alert("이미 싫어요를 눌렀습니다.");
          } else if (response.data.result) {
            setDislikeCount(response.data.unLikeCount);
            setDisliked(true);
            if (liked) {
              setLikeCount((prev) => prev - 1);
              await postApi.deleteLike(postId, token);
              setLiked(false);
            }
          }
        }
      } else {
        const response = await postApi.deleteDislike(postId, token);
        if (response.status === 200 && response.data.result) {
          setDislikeCount(response.data.unLikeCount);
          setDisliked(false);
        }
      }
    } catch (error) {
      console.error("싫어요 처리 중 오류 발생:", error);
    }
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
    currentPage, 
    setCurrentPage,
    fetchPosts,
    fetchRecommendedPosts,
    handlePostClick,
    handleSavePost,
    handleUpdatePost,
    handleDelete,
    liked,
    setLiked,
    disliked,
    setDisliked,
    likeCount,
    setLikeCount,
    dislikeCount,
    setDislikeCount,
    handleLike,
    handleDislike,
    getComments,
    isModalOpen,
    modalMessage,
    handleModalClose,
    setIsConfirmModalOpen,
    isConfirmModalOpen,
  };
};
