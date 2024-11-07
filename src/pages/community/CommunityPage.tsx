import React, { useEffect, useState } from "react";
import PostList from "./communityComponent/PostList";
import PostForm from "./communityComponent/PostForm";
import PostDetail from "./communityComponent/PostDetail";
import SearchBar from "./communityComponent/SearchBar";
import Pagination from "./communityComponent/Pagination";
import CategoryTabs from "./communityComponent/CategoryTabs";
import SubcategoryTabs from "./communityComponent/SubcategoryTabs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CommunityPage.css";
import RecommendedKeywords from "./communityComponent/RecommendedKeywords";
import categoriesJson from "../../assets/data/categories.json";
import axios from "axios";
import { recommendedKeywords, post_up_sports, post_sports } from './communityComponent/data';
import {  useNavigate } from "react-router-dom";



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
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  // comments: number;
  comments_count:number;      
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword:string,
  post_hashtag: string;
  post_like_counts: number;
  isRecommended?: boolean; 
  likeStatus:boolean;
  unlikeStatus:boolean;
  post_img1:string;
  post_img2:string;
  post_unlike_counts : number;
  commets_count:number;
  member_id: number; 
  author:boolean;
}

// categories.json 파일의 타입 정의
interface CategoryData {
  categories: string[];
  subcategories: {
    [key: string]: string[];
  };
}

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState("헬스 및 피트니스");
  const [activePost_sport, setActivePost_sport] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;
  const navigate = useNavigate();

  // 게시글 목록 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log("Fetching posts..."); // 요청 시작 시 로그 출력
    try {
      const token = localStorage.getItem("authToken"); // 토큰을 로컬 스토리지에서 가져옵니다.
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }
      
      console.log("await");
      const response = await axios.get("http://localhost:8001/community/posts", {
        params:{
          page:currentPage,
          size:postsPerPage,
        },
        headers: {
          
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Response data:", response.data); // 응답 데이터 출력

      const fetchedPosts = response.data.posts || response.data;
      const mappedPosts = fetchedPosts.map((post: Post) => ({
        post_id: post.post_id,
        post_title: post.post_title,
        post_contents: post.post_contents || '',
        post_nickname: post.post_nickname,
        post_date: post.post_date,
        post_views: post.post_views,
        comments_count: post.comments_count || 0,
        post_up_sport: post.post_up_sport || '',
        post_sport: post.post_sport,
        post_hashtag: post.post_hashtag || '',
        post_like_counts: post.post_like_counts,
        isRecommended: post.isRecommended || false,
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  /*게시물 작성 폼 표시 핸들러 */
  const handleCreatePost = () => {
    setShowPostForm(true);
  };




  /* 게시물 저장 핸들러 */
  const handleSavePost = async (post_title: string, post_contents: string,
                          post_up_sport: string, post_sport: string,
                          post_sports_keyword:string,
                          post_hashtag: string,
                          imageFiles: FileList | null 
                        ) => {
    
    const formData = new FormData();
    formData.append("post_title", post_title);
    formData.append("post_contents", post_contents);
    formData.append("post_up_sport", post_up_sport);
    formData.append("post_sport", post_sport);
    formData.append("post_hashtag", post_hashtag);; // post_hashtag 배열 추가
    formData.append("post_sports_keyword", post_sports_keyword);; // post_hashtag 배열 추가

    if (imageFiles) {
      for (let i = 0; i < Math.min(imageFiles.length, 2); i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    try{
      const token = localStorage.getItem("authToken");

      if(!token){

        alert("로그인이 필요합니다.");
        return; 
      }

                                        
      const response = await axios.post("http://localhost:8001/community/posts/effortpost",formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },

      });
      
      if(response.status >= 200 && response.status < 300) {
        const savedPost = response.data;
        setPosts((posts) => [savedPost, ...posts]);
        setShowPostForm(false);
        alert("게시글이 성공적으로 저장되었습니다.");


        await fetchPosts();

        setShowPostForm(false);
      }else{
        alert("게시글 저장에 실패했습니다.");
        navigate('/communitypage'); 
      }

    }catch(error){
      console.error("Error", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
    
  };






  /*게시물 수정 폼 핸들러 */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /*게시물 수정시 업데이트 처리리 핸들러 */
  const handleUpdatePost = async (post_title: string, post_contents: string,
                            post_up_sport: string, post_sport: string, 
                            post_sports_keyword:string,
                            post_hashtag: string,
                            imageFiles: FileList | null) => {
    if (selectedPost) {

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
    

      try{
            const token = localStorage.getItem("authToken");

            if(!token){
      
              alert("로그인이 필요합니다.");
              return; 
            }
            const response = await axios.put(`http://localhost:8001/community/posts/${selectedPost.post_id}/update`, formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
        
            });

            console.log("respons  ", response.data);
            
        if(response.status >= 200 && response.status < 300){
            const updatedPost = response.data;
            console.log("updatePost" , updatedPost);
            setPosts((posts) =>
              posts.map( (post) => 
              post.post_id === selectedPost.post_id ? updatedPost : post
            ));
            setSelectedPost(updatedPost);
            setIsEditing(false);
            alert("게시글이 수정되었습니다.");
            navigate('/communitypage');
        }else{
          console.error('게시글을 수정 할 수 없습니다. : ' + response);
          navigate('/communitypage');
        }
      }catch(error){
        console.error('서버와의 통신 중 오류가 발생했습니다.: ' + error);
        navigate('/communitypage');
      
      }
    }
  };

  /*게시물 삭제 핸들러 */
  const handleDelete = async() => {
    if (selectedPost && window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.post_id !== selectedPost.post_id))
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`http://localhost:8001/community/posts/${selectedPost.post_id}/delete`, {
          headers:{
            Authorization : `Bearer ${token}`
          }
        });

        if(response.status=== 200){
          alert(response.data);
          setSelectedPost(null);
          navigate('/communitypage'); 
        }else{
          alert(response.data);
          navigate('/communitypage'); 
        }

      }catch(error){
        console.error('서버와의 통신 중 오류가 발생했습니다.: ' + error);
      }


     
    }
  };

  const [isAuthor, setIsAuthor] = useState(false);

  /* 게시물 상세보기 및 클릭 핸들러, 클릭 시 조회수 증가 */
  const handlePostClick = async  (post: Post) => {
    try{
      console.log("게시글 클릭됨 : " , post);
      // 서버와의 비동기 통신 시작
      const token = localStorage.getItem("authToken");

      if(!token){

        alert("로그인이 필요합니다.");
        return; 
      }
      console.log("token" , token);


      const response = await axios.get(`http://localhost:8001/community/posts/${post.post_id}/detail`,{
        headers: {
            
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("게시글 상세 정보 : ", response.data);

      setSelectedPost(response.data);
      setIsAuthor(response.data.Author);
      console.log("Author" , response.data.Author);

    } catch (error) {
    console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
  }
    
  };

  /* 게시물 상세보기에서 뒤로가기 핸들러 */
  const handleBack = () => {
    setSelectedPost(null);
    setIsEditing(false);
  };

  /* 댓글 좋아요/싫어요 핸들러 */
  const handleCommentReaction = (
    commentId: number,
    reactionType: "like" | "dislike"
  ) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (reactionType === "like") {
            return { ...comment, likeCount: comment.likeCount + 1 };
          } else {
            return { ...comment, dislikeCount: comment.dislikeCount + 1 };
          }
        }
        return comment;
      })
    );
  };

  /* 댓글 작성 핸들러 */
  const handleAddComment = (postId: number, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newComment: Comment = {
      id: comments.length + 1,
      postId,
      author: "댓글 작성자",
      content,
      date: formattedDate,
      likeCount: 0,
      dislikeCount: 0,
    };

    setComments([...comments, newComment]);

    // 게시글의 댓글 수 업데이트
    setPosts(posts.map(post => {
      if (post.post_id === postId) {
        // return { ...post, comments: post.comments + 1 };
        return { ...post, comments_count: post.comments_count + 1 };
      }
      return post;
    }));

    // 현재 선택된 게시글의 댓글 수 업데이트
    if (selectedPost && selectedPost.post_id === postId) {
      // setSelectedPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
      setSelectedPost(prev => prev ? { ...prev, comments: prev.comments_count + 1 } : null);
    }
  };

  /* 카테고리 변경 핸들러 */
  const handleCategoryChange = (post_up_sport: string) => {
    setActiveTab(post_up_sport);
    setActivePost_sport("");
  };

  /* 카테고리 소분류 변경 핸들러 */
  const handleSubcategoryChange = async (post_sport: string) => {
    setActivePost_sport(post_sport);
    const token = localStorage.getItem("authToken");
   
    if(!token){

      alert("로그인이 필요합니다.");
      return; 
    }
    console.log("token" , token);
    
    try{
        
      const post_sports = encodeURIComponent(post_sport.replace(/\//g, "_slash_"));
        const response = await axios.get(`http://localhost:8001/community/posts/${post_sports}`, {
            params:{
              post_up_sport :activeTab,
              page: currentPage,
              size: postsPerPage,
            },
            headers: {
                  
              Authorization: `Bearer ${token}`,
            },
            
          });

        if(response.status === 200){
          const fetchedPosts = response.data.sportpost;
          const mappedPosts = fetchedPosts.map((post:Post) => ({
            post_id : post.post_id,
            post_title: post.post_title,
            post_contents: post.post_contents || "",
            post_nickname: post.post_nickname,
            post_date: post.post_date,
            post_views: post.post_views,
            comments_count: post.comments_count || 0,
            post_up_sport: post.post_up_sport || "",
            post_sport: post.post_sport,
            post_hashtag: post.post_hashtag || "",
            post_like_counts: post.post_like_counts,
            isRecommended: post.isRecommended || false,
          }));
          
          setPosts(mappedPosts);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }else{
          console.error("데이터를 가져오는 중 오류 발생:", response.statusText);
          alert("데이터를 가져오는 중 오류가 발생했습니다.");
        }
    }catch(error){

      console.error("서버와의 통신 중 오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");

    }

  };

  

  /* 검색 핸들러 */
  const handleSearch = async (searchTerm: string) => {
    // 검색 로직 구현
    console.log("Searching for:", searchTerm);
    if(searchTerm.trim() === ""){
      setSearchResults(null);
      return;
    }

    try{
      const token = localStorage.getItem("authToken");
      if(!token){
        console.error("로그인 토큰이 없습니다.");
        return;
      }

      // 서버 
      const response = await axios.get("http://localhost:8001/community/posts/search", {
        params:{
          keyword:searchTerm,
          page:currentPage,
          size:postsPerPage,
        },
        headers:{
          Authorization: `Bearer ${token}`,
        },

      });
      if(response.status === 200){
        const fetchedPosts = response.data.posts;
        // 오류 방지
        const mappedPosts = fetchedPosts.map((post: Post) => ({
          post_id: post.post_id,
          post_title: post.post_title,
          post_contents: post.post_contents || '',
          post_nickname: post.post_nickname,
          post_date: post.post_date,
          post_views: post.post_views,
          comments_count: post.comments_count || 0,
          post_up_sport: post.post_up_sport || '',
          post_sport: post.post_sport,
          post_hashtag: post.post_hashtag || '',
          post_like_counts: post.post_like_counts,
          isRecommended: post.isRecommended || false,
        }));
        
        setSearchResults(mappedPosts);

      }else{
        console.error("검색 결과를 가져오는 중 오류 발생 : " ,response.statusText );
        alert("검색 결과를 가져오던 중 오류가 발생했습니다.");
        setSearchResults([]);
      }
    }catch(error){
      console.error("서버와의 통신 중 오류 발생 : " , error);
      alert("서버와의 통신에서 오류가 발생했습니다.");
      setSearchResults([]);
    }
 
  };

  /* 페이지 번호 변경 핸들러 */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  
  };

  // 페이지네이션 관련 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPosts = searchResults ? searchResults.sort((a, b) => b.post_id - a.post_id) : posts
    // .filter(post => {
    //   const matchesPost_up_sport = post.post_up_sport === activeTab;
    //   const matchesPost_sport = activePost_sport === "" || post.post_sport === activePost_sport;
    //   return matchesPost_up_sport && matchesPost_sport;
    // })
    .sort((a, b) => b.post_id - a.post_id);

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const calculatedTotalPages = Math.ceil(filteredPosts.length / postsPerPage);


  /**
   * 게시물 수정 모드일 때의 렌더링
   * 선택된 게시물이 있고 수정 폼 작성 상태일 때 PostForm 컴포넌트를 표시
   */
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
          post_sports_keyword : selectedPost.post_sports_keyword,
        }}
        onSave={handleUpdatePost}
        onCancel={() => setIsEditing(false)}
        post_up_sports={post_up_sports}
        post_sports={post_sports}
        recommendedKeywords={recommendedKeywords}
      />
    );
  }

  /**
   * 게시물 상세보기 모드일 때의 렌더링
   * 선택된 게시물이 있을 때 PostDetail 컴포넌트를 표시
   */
  if (selectedPost) {
    const postComments = comments.filter(comment => comment.postId === selectedPost.post_id);
    return (
      <PostDetail
      post_id = {selectedPost.post_id}
      post_title={selectedPost.post_title}
      post_contents={selectedPost.post_contents}
      post_nickname={selectedPost.post_nickname}
      post_date={selectedPost.post_date}
      post_views={selectedPost.post_views}
      post_up_sport={selectedPost.post_up_sport}
      post_sport={selectedPost.post_sport}
      post_sports_keyword = {selectedPost.post_sports_keyword}
      post_hashtag={selectedPost.post_hashtag}
      likeStatus={selectedPost.likeStatus}
      post_img1 ={selectedPost.post_img1}
      post_img2 = {selectedPost.post_img2}
      post_unlike_counts = {selectedPost.post_unlike_counts}
      post_like_counts = {selectedPost.post_like_counts}
      commets_count = {selectedPost.comments_count}
      unlikeStatus = {selectedPost.unlikeStatus}
      member_id = {selectedPost.member_id}
      author = {selectedPost.author}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserNickname={""}
        comments={postComments}
        onAddComment={(content) => handleAddComment(selectedPost.post_id, content)}
        onCommentReaction={handleCommentReaction}
      />
    );
  }

  /* 메인 화면 렌더링 */
  return (
    <div className="community-container">
      <CategoryTabs
        post_up_sports={post_up_sports}
        activeTab={activeTab}
        onTabChange={handleCategoryChange}
      />

      <SubcategoryTabs
        post_sports={post_sports[activeTab] || []}
        activePost_sport={activePost_sport}
        onSubcategoryChange={handleSubcategoryChange}
      />

      {/* 게시물 작성 폼 또는 게시물 목록 표시 */}
      {showPostForm ? (
        <PostForm
          mode="create"
          initialData={{
            post_title: "",
            post_contents: "",
            post_up_sport: activeTab,
            post_sport: activePost_sport,
            post_hashtag: "",
            post_sports_keyword:"",
          }}
          onSave={handleSavePost}
          onCancel={() => setShowPostForm(false)}
          post_up_sports={post_up_sports}
          post_sports={post_sports}
          recommendedKeywords={recommendedKeywords}
        />
      ) : (
        <>
         <RecommendedKeywords keywords={recommendedKeywords} /> 

          {/* 검색바와 게시물 작성 버튼 */}
          <div className="search-and-write">
            <SearchBar onSearch={handleSearch} />
            <button
              className="btn btn-primary write-button"
              onClick={handleCreatePost}
            >
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
