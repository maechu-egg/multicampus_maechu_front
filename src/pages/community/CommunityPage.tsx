import React, { useState } from "react";
import PostList from "./communityComponent/PostList";
import PostForm from "./communityComponent/PostForm";
import PostDetail from "./communityComponent/PostDetail";
import SearchBar from "./communityComponent/SearchBar";
import Pagination from "./communityComponent/Pagination";
import CategoryTabs from "./communityComponent/CategoryTabs";
import SubcategoryTabs from "./communityComponent/SubcategoryTabs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CommunityPage.css";
import RecommendedKeywords from './communityComponent/RecommendedKeywords';

// 댓글 타입 정의
interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  likeCount: number;
  dislikeCount: number;
}

// 게시물 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  category: string;
  subcategory: string;
  tags: string[];
  likeCount: number;
  isRecommended?: boolean; 
}

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState("헬스 및 피트니스");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

    // 임시 키워드 데이터 (나중에 백엔드에서 받아올 예정)
  const recommendedKeywords = ["운동", "헬스", "다이어트", "건강", "요가"];

  //카테고리
  const categories = ["헬스 및 피트니스", "단체 스포츠", "개인  스포츠", "레저 및 아웃도어 스포츠", "댄스 및 퍼포먼스 운동"];
  // 카테고리 소분류
  const subcategories: { [key: string]: string[] } = {
    "헬스 및 피트니스": [
      "헬스(웨이트 트레이닝)",
      "필라테스",
      "요가",
      "크로스핏",
      "사이클(스피닝)",
      "홈 트레이닝",
      "러닝/조깅",
      "HIIT"
    ],
    "단체 스포츠": [
      "축구",
      "농구",
      "배구",
      "풋살",
      "핸드볼",
      "럭비",
      "야구"
    ],
    "개인  스포츠": [
      "테니스",
      "배드민턴",
      "탁구",
      "골프",
      "스쿼시",
      "클라이밍",
      "격투기"
    ],
    "레저 및 아웃도어 스포츠": [
      "수영",
      "서핑",
      "스킨스쿠버",
      "스케이트보드 / 롱보드",
      "하이킹 / 트레킹",
      "스키 / 스노보드",
      "카약 / 래프팅",
      "패러글라이딩"
    ],
    "댄스 및 퍼포먼스 운동": [
      "줌바",
      "힙합댄스",
      "라틴댄스",
      "발레",
      "스트릿 댄스"
    ]
  };

  /*게시물 작성 폼 표시 핸들러 */
  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  /* 게시물 저장 핸들러 */
  const handleSavePost = (title: string, content: string, category: string, subcategory: string, tags: string[]) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newPost: Post = {
      id: posts.length + 1,
      title,
      content,
      author: "작성자",
      date: formattedDate,
      views: 0,
      comments: 0,
      category,
      subcategory,
      tags: tags,
      likeCount: 0,
    };
    setPosts([...posts, newPost]);
    setShowPostForm(false);
  };

  /*게시물 수정 폼 핸들러 */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /*게시물 수정시 업데이트 처리리 핸들러 */
  const handleUpdatePost = (title: string, content: string, category: string, subcategory: string, tags: string[]) => {
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        title,
        content,
        category,
        subcategory,
        tags,
      };
      
      setPosts(posts.map(post => 
        post.id === selectedPost.id ? updatedPost : post
      ));
      
      setSelectedPost(updatedPost);
      setIsEditing(false);
    }
  };

  /*게시물 삭제 핸들러 */
  const handleDelete = () => {
    if (selectedPost && window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setSelectedPost(null);
    }
  };

  /* 게시물 클릭 핸들러, 클릭 시 조회수 증가 */
  const handlePostClick = (post: Post) => {
    const updatedPost = { ...post, views: post.views + 1 };
    setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    setSelectedPost(updatedPost);
  };

  /* 게시물 상세보기에서 뒤로가기 핸들러 */
  const handleBack = () => {
    setSelectedPost(null);
    setIsEditing(false);
  };

  /* 댓글 좋아요/싫어요 핸들러 */
  const handleCommentReaction = (commentId: number, reactionType: 'like' | 'dislike') => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (reactionType === 'like') {
          return { ...comment, likeCount: comment.likeCount + 1 };
        } else {
          return { ...comment, dislikeCount: comment.dislikeCount + 1 };
        }
      }
      return comment;
    }));
  };

  /* 댓글 작성 핸들러 */
  const handleAddComment = (postId: number, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newComment: Comment = {
      id: comments.length + 1,
      postId,
      author: "댓글 작성자",
      content,
      date: formattedDate,
      likeCount: 0,
      dislikeCount: 0
    };

    setComments([...comments, newComment]);
    
    // 게시글의 댓글 수 업데이트
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));

    // 현재 선택된 게시글의 댓글 수 업데이트
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    }
  };

  /* 카테고리 변경 핸들러 */
  const handleCategoryChange = (category: string) => {
    setActiveTab(category);
    setActiveSubcategory("");
  };

  /* 카테고리 소분류 변경 핸들러 */
  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
  };

  /* 검색 핸들러 */
  const handleSearch = (searchTerm: string) => {
    // 검색 로직 구현
    console.log("Searching for:", searchTerm);
  };

  /* 페이지 번호 변경 핸들러 */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 페이지네이션 관련 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = post.category === activeTab;
      const matchesSubcategory = activeSubcategory === "" || post.subcategory === activeSubcategory;
      return matchesCategory && matchesSubcategory;
    })
    .sort((a, b) => b.id - a.id);

  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);


    /**
   * 게시물 수정 모드일 때의 렌더링
   * 선택된 게시물이 있고 수정 폼 작성 상태일 때 PostForm 컴포넌트를 표시
   */
  if (isEditing && selectedPost) {
    return (
      <PostForm
        mode="edit"
        initialData={{
          title: selectedPost.title,
          content: selectedPost.content,
          category: selectedPost.category,
          subcategory: selectedPost.subcategory,
          tags: selectedPost.tags,
        }}
        onSave={handleUpdatePost}
        onCancel={() => setIsEditing(false)}
        categories={categories}
        subcategories={subcategories}
      />
    );
  }

  /**
   * 게시물 상세보기 모드일 때의 렌더링
   * 선택된 게시물이 있을 때 PostDetail 컴포넌트를 표시
   */
  if (selectedPost) {
    const postComments = comments.filter(comment => comment.postId === selectedPost.id);
    return (
      <PostDetail
        title={selectedPost.title}
        content={selectedPost.content}
        author={selectedPost.author}
        date={selectedPost.date}
        views={selectedPost.views}
        category={selectedPost.category}
        tags={selectedPost.tags}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserNickname={""}
        comments={postComments}
        onAddComment={(content) => handleAddComment(selectedPost.id, content)}
        onCommentReaction={handleCommentReaction}
      />
    );
  }

  
  /* 메인 화면 렌더링 */
  return (
    <div className="community-container">
      <CategoryTabs
        categories={categories}
        activeTab={activeTab}
        onTabChange={handleCategoryChange}
      />

      <SubcategoryTabs
        subcategories={subcategories[activeTab] || []}
        activeSubcategory={activeSubcategory}
        onSubcategoryChange={handleSubcategoryChange}
      />

      {/* 게시물 작성 폼 또는 게시물 목록 표시 */}
      {showPostForm ? (
        <PostForm
          mode="create"
          initialData={{
            title: "",
            content: "",
            category: activeTab,
            subcategory: activeSubcategory,
            tags: []
          }}
          onSave={handleSavePost}
          onCancel={() => setShowPostForm(false)}
          categories={categories}
          subcategories={subcategories}
        />
      ) : (
        <>
         {/* <RecommendedKeywords keywords={recommendedKeywords} /> 키워드 */} 

         {/* 검색바와 게시물 작성 버튼 */}
          <div className="search-and-write">
            <SearchBar onSearch={handleSearch} />
            <button className="btn btn-primary write-button" onClick={handleCreatePost}>
              게시물 작성
            </button>
          </div>

          {/* 게시물 목록 */}
          <PostList posts={currentPosts} onPostClick={handlePostClick} />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default CommunityPage;