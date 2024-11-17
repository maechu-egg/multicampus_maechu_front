import React, { useEffect, useState } from "react";
import PostList from "./communityComponent/PostList";
import PostForm from "./communityComponent/PostForm";
import PostDetail from "./communityComponent/PostDetail";
import SearchBar from "./communityComponent/SearchBar";
import Pagination from "./communityComponent/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CommunityPage.css";
import RecommendedKeywords from "./communityComponent/RecommendedKeywords";
import categoriesJson from "../../assets/data/categories.json";
import dataJson from "../../assets/data/data.json";
import axios from "axios";
import CategoryDropdown from './communityComponent/CategoryDropdown';
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { useComment } from '../../hooks/community/useComment';
import { Post,usePost } from '../../hooks/community/usePost';
import { useSearch } from '../../hooks/community/useSearch';
import { useCategory } from "hooks/community/useCategory";
import { usePagination } from "hooks/community/usePagination";

interface CategoryData {
  categories: string[];
  subcategories: {
    [key: string]: string[];
  };
}

export interface CommunityData {
  recommendedKeywords: string[];
  post_up_sports: string[];
  post_sports: {
    [key: string]: string[];
  };
}

const data: CommunityData = dataJson;
const recommendedKeywords = data.recommendedKeywords;
const post_up_sports = data.post_up_sports;
const post_sports = data.post_sports;

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [activePost_sport, setActivePost_sport] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // currentPage 상태 추가
  const postsPerPage = 10;
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();

 
   // 2. usePost 훅을 먼저 사용
   const {
     posts,
     setPosts,
     recommendedPosts,
     setRecommendedPosts,
     selectedPost,
     setSelectedPost,
     loading,
     isAuthor,
     fetchPosts,
     fetchRecommendedPosts,
     handlePostClick,
     handleSavePost,
     handleUpdatePost,
     handleDelete,
   } = usePost();
 
   // 3. useSearch 훅
   const {
     isSearchActive,
     setIsSearchActive,
     searchTerm,
     searchKeyword,
     handleSearch,
     handleKeywordClick,
   } = useSearch(postsPerPage, setPosts, setCurrentPage, setTotalPages);
 
   // 4. useCategory 훅
   const {
    activeTab,
    setActiveTab,
    loading: categoryLoading,
    handleCategoryChange,
    handleSubcategoryChange,
  } = useCategory({
    setIsSearchActive,
    setShowPostForm,
    setCurrentPage,
    setPosts,
    postsPerPage,
    setActivePost_sport,
    setTotalPages,
     fetchPosts
  });
 
   // 5. usePagination 훅
   const {
    loading: paginationLoading,
    handlePageChange
  } = usePagination({
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
  });
  

    // 페이지 상태 초기화 함수
  const resetPageState = () => {
    setShowPostForm(false);
    setSelectedPost(null);
    setIsEditing(false);
    setCurrentPage(1);
    setIsSearchActive(false);
    setActiveTab("헬스 및 피트니스");
    setActivePost_sport("");
  };

  const {
    comments, 
    setComments,
    commentInput,
    setCommentInput,
    getComments,
    handleCommentSubmit,
    handleCommentDelete,
  } = useComment();

  
// location이 변경될 때마다 상태 초기화
useEffect(() => {
  const locationState = location.state as { 
    fromMyPage?: boolean;
    selectedPostId?: number;
    selectedPost?: any;
  };

  if (locationState?.fromMyPage && locationState?.selectedPost) {
    // MyPage에서 넘어온 경우, handlePostClick 함수를 직접 호출
    handlePostClick(locationState.selectedPost, false);
    getComments(locationState.selectedPost.post_id);
  } else {
    resetPageState();
    fetchPosts("헬스 및 피트니스", "", 1, postsPerPage);
  }
}, [location]);


// 카테고리나 페이지 변경시
useEffect(() => {
  if (!isSearchActive && !loading) {
    fetchPosts(
      activeTab,  // 카테고리
      activePost_sport,  // 서브카테고리
      currentPage,  // 페이지 번호
      postsPerPage  // 페이지 크기
    );
  }
}, [activeTab, activePost_sport, currentPage]);




  useEffect(() => {
    if (!isSearchActive && activePost_sport === "") {
      fetchRecommendedPosts(activeTab);
    }
  }, [activeTab]);


  useEffect(() => {
    if (activePost_sport !== "") {
      setRecommendedPosts([]);
    }
  }, [activePost_sport]);

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };



  const handleBack = () => {
    setSelectedPost(null);
    setIsEditing(false);
  };

  if (isEditing && selectedPost) {
    return (
      <PostForm
        mode="edit"
        initialData={{
          post_title: selectedPost.post_title,
          post_contents: selectedPost.post_contents,
          post_up_sport: selectedPost.post_up_sport,
          post_sport: selectedPost.post_sport,
          post_hashtag: selectedPost.post_hashtag,
          post_sports_keyword: selectedPost.post_sports_keyword,
        }}
        onSave={(post_title, post_contents, post_up_sport, post_sport, post_sports_keyword, post_hashtag, imageFiles) => 
          handleUpdatePost(selectedPost.post_id, post_title, post_contents, post_up_sport, post_sport, post_sports_keyword, post_hashtag, imageFiles)}
        onCancel={() => setIsEditing(false)}
        post_up_sports={post_up_sports}
        post_sports={post_sports}
        recommendedKeywords={recommendedKeywords}
      />
    );
  }

  if (selectedPost) {
    console.log("Selected Post Data:", {
      post_img1: selectedPost.post_img1,
      post_img2: selectedPost.post_img2
    });
    return (
      <PostDetail
        post_id={selectedPost.post_id}
        post_title={selectedPost.post_title}
        post_contents={selectedPost.post_contents}
        post_nickname={selectedPost.post_nickname}
        post_date={selectedPost.post_date}
        post_views={selectedPost.post_views}
        post_up_sport={selectedPost.post_up_sport}
        post_sport={selectedPost.post_sport}
        post_sports_keyword={selectedPost.post_sports_keyword}
        post_hashtag={selectedPost.post_hashtag}
        likeStatus={selectedPost.likeStatus}
        post_img1={selectedPost.post_img1}
        post_img2={selectedPost.post_img2}
        post_unlike_counts={selectedPost.post_unlike_counts}
        post_like_counts={selectedPost.post_like_counts}
        commets_count={selectedPost.comments_count}
        unlikeStatus={selectedPost.unlikeStatus}
        member_id={selectedPost.member_id}
        author={selectedPost.author}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={() => handleDelete(selectedPost.post_id)}
        comments={comments}
        onAddComment={(content) => handleCommentSubmit(selectedPost.post_id, content)}
        onCommentDelete={handleCommentDelete}
        currentUserNickname={""}
        getComments={getComments}
        onCommentLike={(commentId, postId) => {
          // 댓글 좋아요 처리 로직
          console.log('Comment like:', commentId, postId);
        }}
        onCommentDislike={(commentId, postId) => {
          // 댓글 싫어요 처리 로직
          console.log('Comment dislike:', commentId, postId);
        }}
      />
    );
  }
  /* 메인 화면 렌더링 */
  return (
    <div className="community-container">
      {!showPostForm && (
        <CategoryDropdown
          post_up_sports={post_up_sports}
          activeTab={activeTab}
          activePost_sport={activePost_sport}
          onTabChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          recommendedKeywords={recommendedKeywords}
          onKeywordClick={(keyword) => handleKeywordClick(keyword, activeTab)}  
        />
      )}

      {showPostForm ? (
        <PostForm
          mode="create"
          initialData={{
            post_title: "",
            post_contents: "",
            post_up_sport: activeTab,
            post_sport: activePost_sport,
            post_hashtag: "",
            post_sports_keyword: "",
          }}
          onSave={handleSavePost}
          onCancel={() => setShowPostForm(false)}
          post_up_sports={post_up_sports}
          post_sports={post_sports}
          recommendedKeywords={recommendedKeywords}
        />
      ) : (
        <>
          <div className="search-and-write">
            <SearchBar onSearch={handleSearch} />
            <button
              className="btn btn-primary write-button"
              onClick={handleCreatePost}
            >
              글쓰기
            </button>
          </div>

        
          <PostList 
            posts={posts}  
            recommendedPosts={recommendedPosts} 
            onPostClick={handlePostClick} 
          />

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
{console.log("totalPages:", totalPages)} 
        </>
      )}
    </div>
  );
}

export default CommunityPage;
