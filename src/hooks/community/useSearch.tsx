import { useState } from 'react';
import { Post } from './usePost';
import { searchApi } from '../../services/api/community/searchApi';
import { useNavigate } from 'react-router-dom';

export const useSearch = (
  postsPerPage: number, 
  setPosts: (posts: Post[]) => void,
  setCurrentPage: (page: number) => void,
  setTotalPages: (pages: number) => void
) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  const shouldNavigateToCommunityPage = (message: string) => {
    return message !== "검색 결과가 없습니다.";
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMessage("");
  
    if (shouldNavigateToCommunityPage(modalMessage)) {
      navigate("/communitypage");
    }
  };
  const handleSearch = async (searchTerm: string, page: number = 1) => {
    console.log("Searching for:", searchTerm);
    if (searchTerm.trim() === "") {
      setIsSearchActive(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }

      setSearchTerm(searchTerm);
      setSearchKeyword("");
      setIsSearchActive(true);
      setPosts([]);
      setLoading(true);
      setCurrentPage(1);

      const response = await searchApi.searchPosts(searchTerm, page, postsPerPage, token);

      if (response.status === 200) {
        const fetchedPosts = response.data.posts;
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setPosts([]);
          setModalMessage("검색 결과가 없습니다.");
          setIsModalOpen(true);
          setCurrentPage(1);
          setTotalPages(1);
        } else {
            const mappedPosts = fetchedPosts.map((post: any) => ({
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
                post_sports_keyword: post.post_sports_keyword || '',
                post_hashtag: post.post_hashtag || '',
                post_like_counts: post.post_like_counts || 0,
                post_unlike_counts: post.post_unlike_counts || 0,
                isRecommended: post.isRecommended || false,
                likeStatus: post.likeStatus || false,
                unlikeStatus: post.unlikeStatus || false,
                post_img1: post.post_img1 || '',
                post_img2: post.post_img2 || '',
                member_id: post.member_id || 0,
                author: post.author || false,
                current_points : post.current_points,
                crew_current_points:post.crew_current_points,
                member_badge_level: getLevelLabel(post.current_points),
                crew_badge_level :  getLevelLabel(post.crew_current_points),
                crew_battle_wins : post.crew_battle_wins,
              }));
          setPosts(mappedPosts);
          setTotalPages(response.data.totalPages);
        }
      }  else if (response.status >= 400) {
        console.error("검색 결과를 가져오는 중 오류 발생: ", response.statusText);
        setModalMessage("검색 결과를 가져오던 중 오류가 발생했습니다.");
        setIsModalOpen(true);
        setPosts([]);
      }
    } catch (error:any) {
      if (error.response && error.response.status === 404) {
        console.error("검색 결과가 없습니다: ", error.response.data.message || error.response.statusText);
        setModalMessage("검색 결과가 없습니다.");
        setIsModalOpen(true);
        setPosts([]);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        console.error("서버와의 통신 중 오류 발생:", error);
        setModalMessage("서버와의 통신에서 오류가 발생했습니다.");
        setIsModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordClick = async (keyword: string, selectedCategory: string) => {
    console.log("키워드  : ", keyword);
    console.log("대분류  : ", selectedCategory);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }
      setSearchKeyword(keyword);
      setSearchTerm("");
      setIsSearchActive(true);
      setPosts([]);
      setLoading(true);
      setCurrentPage(1);

      
      const response = await searchApi.searchByKeyword(
        keyword, 
        1, 
        postsPerPage, 
        selectedCategory, 
        token
      );
      setCurrentPage(1);
      
      if (response.status === 200) {
        const fetchedPosts = response.data.searchList;
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setPosts([]);
          setModalMessage("검색 결과가 없습니다.");
          setIsModalOpen(true);
          setCurrentPage(1);
          setTotalPages(1);
        } else {
          setPosts(fetchedPosts);
          setIsSearchActive(true);
          setTotalPages(response.data.totalPages);
        }
      } else {
        console.error("키워드 검색 결과를 가져오는 중 오류 발생:", response.statusText);
        setModalMessage("키워드 검색 결과를 가져오던 중 오류가 발생했습니다.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("서버와의 통신 중 오류 발생:", error);
      setModalMessage("서버와의 통신에서 오류가 발생했습니다.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
  };

  return {
    isSearchActive,
    setIsSearchActive,
    searchTerm,
    setSearchTerm,
    searchKeyword,
    setSearchKeyword,
    loading,
    handleSearch,
    handleKeywordClick,
    isModalOpen,
    modalMessage,
    handleModalClose,
  };
};