import { useState, Dispatch, SetStateAction } from 'react';
import { categoryApi } from '../../services/api/community/categoryApi';

interface Comment {
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

interface Post {
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

interface UseCategoryProps {
  setIsSearchActive: (active: boolean) => void;
  setShowPostForm: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  setActivePost_sport: (sport: string) => void;
  setPosts: Dispatch<SetStateAction<Post[]>>;
  postsPerPage: number;
  setTotalPages: (pages: number) => void;
  fetchPosts: (category?: string, subcategory?: string, page?: number) => Promise<void>;
}
export const useCategory = ({
  setIsSearchActive,
  setShowPostForm,
  setCurrentPage,
  setActivePost_sport,
  setPosts,
  postsPerPage,
  setTotalPages,
  fetchPosts
}: UseCategoryProps) => {
  const [activeTab, setActiveTab] = useState("헬스 및 피트니스");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = async (post_up_sport: string) => {
    try {
      setLoading(true);
      console.log("카테고리 변경됨:", post_up_sport);
      
      // 상태 업데이트를 한꺼번에 처리
      await Promise.all([
        setActiveTab(post_up_sport),
        setActivePost_sport(""),
        setIsSearchActive(false),
        setShowPostForm(false),
        setCurrentPage(1)
      ]);
  
      // 상태 업데이트가 완료된 후 데이터 fetch
      await fetchPosts(post_up_sport, "", 1);
    } catch (error) {
      console.error("카테고리 변경 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubcategoryChange = async (post_sport: string) => {
    try {
      setLoading(true);
      console.log("서브카테고리 변경됨:", post_sport);
      
      // 상태 업데이트를 한꺼번에 처리
      await Promise.all([
        setActivePost_sport(post_sport),
        setIsSearchActive(false),
        setShowPostForm(false)
      ]);
  
      // 상태 업데이트가 완료된 후 데이터 fetch
      await fetchPosts(activeTab, post_sport);
    } catch (error) {
      console.error("서브카테고리 변경 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    handleCategoryChange,
    handleSubcategoryChange,
  };
};