import { useState } from 'react';
import { Post } from './usePost';
import { paginationApi } from '../../services/api/community/paginationApi';

interface UsePaginationProps {
  postsPerPage: number;
  isSearchActive: boolean;
  searchKeyword: string;
  searchTerm: string;
  activeTab: string;
  activePost_sport: string;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}

export const usePagination = ({
  postsPerPage,
  isSearchActive,
  searchKeyword,
  searchTerm,
  activeTab,
  activePost_sport,
  setPosts,
  currentPage,
  setCurrentPage,
  setTotalPages
}: UsePaginationProps) => {
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (pageNumber: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }
  
      setLoading(true);
      setCurrentPage(pageNumber);
  
      if (isSearchActive) {
        if (searchKeyword) {
          const response = await paginationApi.getKeywordSearchResultsByPage({
            keyword: searchKeyword,
            category: activeTab,
            page: pageNumber,
            size: postsPerPage
          }, token);

          if (response.data.searchList) {
            setPosts(response.data.searchList);
            setTotalPages(response.data.totalPages);
          }
        } else if (searchTerm) {
          const response = await paginationApi.getSearchResultsByPage({
            searchTerm,
            page: pageNumber,
            size: postsPerPage
          }, token);

          if (response.data.posts) {
            const mappedPosts = response.data.posts.map((post: Post) => ({
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
            setTotalPages(response.data.totalPages);
          }
        }
      } else {
        const response = await paginationApi.getPostsByPage({
          page: pageNumber,
          size: postsPerPage,
          post_up_sport: activeTab,
          post_sport: activePost_sport
        }, token);
  
        if (response.data) {
          const mappedPosts = response.data.posts.map((post: Post) => ({
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
          setTotalPages(response.data.totalPages);
          console.log("Total pages set to:", response.data.totalPages); // 디버깅용 로그 추가
        }
      }
    } catch (error: any) {
      console.error("페이지 데이터를 가져오는 중 오류 발생:", error);
      if (error.response?.status === 403) {
        localStorage.removeItem("authToken");
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handlePageChange
  };
};