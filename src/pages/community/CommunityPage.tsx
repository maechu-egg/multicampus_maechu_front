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
import dataJson from "../../assets/data/data.json";
import axios from "axios";
import CategoryDropdown from './communityComponent/CategoryDropdown';
import {  useNavigate, useParams } from "react-router-dom";



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
  comments: Comment[];
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

// 서버로부터 받은 댓글 타입 정의
interface ServerComment  {
  comments_id: number;
  c_nickname: string;
  comments_date: string;
  comments_contents: string;
  comment_like_count: number;
  comment_unlike_count: number;
};

// community 데이터
export interface CommunityData {
  recommendedKeywords: string[];
  post_up_sports: string[];
  post_sports: {
    [key: string]: string[];
  };
}
// community 적용
const data: CommunityData = dataJson;
  // 값 설정
  const recommendedKeywords = data.recommendedKeywords;
  const post_up_sports = data.post_up_sports;
  const post_sports = data.post_sports;

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState("헬스 및 피트니스");
  const [activePost_sport, setActivePost_sport] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>(""); // 댓글 입력 상태
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const { postId } = useParams<{ postId: string }>(); 

  // 게시글 목록 로드

  useEffect(() => {
    if (!isSearchActive) {
      fetchPosts();
    }
  }, [activeTab, activePost_sport, currentPage]);

  // 추천 게시글
  useEffect(() => {
    if (!isSearchActive && activePost_sport === "") {
      fetchRecommendedPosts(activeTab, activePost_sport);
    }
  }, [activeTab, activePost_sport, currentPage]);

  // 소분류가 선택되었을 때 추천 게시글을 숨기도록 상태 변경
  useEffect(() => {
    if (activePost_sport !== "") {
      setRecommendedPosts([]);
    }
  }, [activePost_sport]);

  // postlist 상태
  useEffect(() => {  
    console.log("Updated posts:", posts);
    console.log("filteredPosts:", filteredPosts);
  }, [posts]);
  
  useEffect(() => {
    if (comments.length > 0) {
      console.log('detail comments:', comments);
   
    }
  }, [comments]);

  const fetchPosts = async (selectedCategory = activeTab, selectedSubcategory = activePost_sport) => {
    console.log("selectedCategory", selectedCategory);
    console.log("selectedSubcategory", selectedSubcategory);

    console.log("Fetching posts..."); // 요청 시작 시 로그 출력
    setLoading(true); 
    try {
      const token = localStorage.getItem("authToken"); 
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }
      
      const categoryParam = selectedCategory !== "" ? selectedCategory  : undefined;
      const subcategoryParam = selectedSubcategory !== "" ? selectedSubcategory : undefined;
      console.log("token" , token);
      console.log("await");
      const response = await axios.get("http://localhost:8001/community/posts", {
        params:{
          page:currentPage,
          size:postsPerPage,
          post_up_sport: categoryParam,
          post_sport: subcategoryParam,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });    
      
      console.log("Response data:", response.data); // 응답 데이터 출력

      const fetchedPosts = response.data.posts || response.data;
      
      console.log("Fetched posts:", fetchedPosts);
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
      console.log("Mapped Posts", mappedPosts);
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      setLoading(false);
    }
  };


  const fetchRecommendedPosts = async (selectedCategory = activeTab, selectedSubcategory = activePost_sport) => {
    console.log("RecommendedPosts ");
    console.log("대분류  : " , activeTab);
    console.log("소분류  : " , activePost_sport);

    setLoading(true); 
   
      const token = localStorage.getItem("authToken"); 
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }

      if (selectedCategory && (!selectedSubcategory || selectedSubcategory === "")){
        console.log("추천 게시글 axios");
        try {
          const response = await axios.get('http://localhost:8001/community/posts/userRC', {
            params:{
              post_up_sport: selectedCategory,
              post_sport: undefined,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); // 추천 게시글을 가져오는 API
          console.log("response data", response.data);
          setRecommendedPosts(response.data);
        } catch (error) {
          console.error('추천 게시글 불러오기 오류:', error);
        }
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
    formData.append("post_hashtag", post_hashtag); // post_hashtag 배열 추가
    formData.append("post_sports_keyword", post_sports_keyword); // post_hashtag 배열 추가

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

    /*댓글 삭제 핸들러 */
    const handleCommentDelete = async(commentId: number, postId : number) => {
      if (selectedPost && window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
       
          console.log("commentId", commentId);
          const updatedComments = selectedPost.comments.filter(comment => comment.id !== commentId);
          setSelectedPost({ ...selectedPost, comments: updatedComments });
     


        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.delete(`http://localhost:8001/community/comment/delete/${commentId}`, {
            headers:{
              Authorization : `Bearer ${token}`
            }
          });
  
          if(response.status=== 200){
                 getComments(postId);
          }else{
            alert(response.data);
           
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
      console.log("commnet list : " , response.data.comments);
      setSelectedPost(response.data);
      setIsAuthor(response.data.Author);

      if (Array.isArray(response.data.comments)) {
        console.log("배열 맞음");
        setComments(response.data.comments);
      } else {
        console.error("댓글 데이터가 배열 형태가 아닙니다:", response.data.comments);
      }

      if (response.data.comments != null) {  // null 또는 undefined 둘 다 체크
        const serverComment = response.data.comments; // 서버에서 반환된 새 댓글 데이터
        console.log("Post click serverComment", serverComment);
        const mappedComments: Comment[] = response.data.comments.map((serverComment:ServerComment) => ({
          id: serverComment.comments_id,
          author: serverComment.c_nickname,
          date: serverComment.comments_date,
          content: serverComment.comments_contents,
          likeCount: serverComment.comment_like_count,
          dislikeCount: serverComment.comment_unlike_count,
        }));
        setComments(mappedComments);
        console.log("set commnet list : " , comments);
    }
    console.log("2. set commnet list : " , comments);
  

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
  
  // 댓글 등록
  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!content.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      if(!token){

        alert("로그인이 필요합니다.");
        return; 
      }
      console.log("token" , token);
      const commentData = {
        comments_contents: content,
        post_id: postId,
      };
  
      const response = await axios.post( "http://localhost:8001/community/comment/saveComment",
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
    
        setCommentInput(""); // 입력 필드 초기화
        alert(response.data.message);
        getComments(postId);
      }else{
        alert(response.data.message);
      }
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    }

  }
  // 댓글 list
  const getComments = async (postId: number) => {
    console.log("getComment ! " )
  
    try {
      const token = localStorage.getItem("authToken");
      if(!token){

        alert("로그인이 필요합니다.");
        return; 
      }
      
  
      const response = await axios.get( `http://localhost:8001/community/comment/getComment/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  


        console.log("response data", response.data);
        const serverComment = response.data; // 서버에서 반환된 새 댓글 데이터
        console.log("serverComment", serverComment);
        

        const newComment: Comment[] = serverComment.map((serverComment: any) => {
          return {
            id: serverComment.comments_id,
            postId: serverComment.post_id,
            author: serverComment.c_nickname ?? "Unknown", // c_nickname이 없는 경우 기본값 설정
            content: serverComment.comments_contents,
            date: serverComment.comments_date,
            likeCount: serverComment.comment_like_count ?? 0,
            dislikeCount: serverComment.comment_unlike_count ?? 0,
          };
        });
        console.log("newComment", newComment);
      
        setComments(newComment);
        

    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    }

  }



  /* 카테고리 변경 핸들러 */
const handleCategoryChange = (post_up_sport: string) => {
  console.log("카테고리 변경됨:", post_up_sport);
  setActiveTab(post_up_sport);
  setActivePost_sport("");
  setIsSearchActive(false);
  fetchPosts(post_up_sport, "");
  setShowPostForm(false);
};

/* 카테고리 소분류 변경 핸들러 */
const handleSubcategoryChange = async (post_sport: string) => {
  console.log("서브카테고리 변경됨:", post_sport);
  setActivePost_sport(post_sport);
  setIsSearchActive(false);
  fetchPosts(activeTab, post_sport);
  setShowPostForm(false);
};

 

  const [isSearchActive, setIsSearchActive] = useState(false);


  /* 페이지 번호 변경 핸들러 */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  
  };

  // 페이지네이션 관련 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPosts =  searchResults && searchResults.length > 0  
            ? searchResults.sort((a, b) => b.post_id - a.post_id) 
            : posts
    // .filter(post => {
    //   const matchesPost_up_sport = post.post_up_sport === activeTab;
    //   const matchesPost_sport = activePost_sport === "" || post.post_sport === activePost_sport;
    //   return matchesPost_up_sport && matchesPost_sport;
    // })
    .sort((a, b) => b.post_id - a.post_id);

    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const calculatedTotalPages = Math.ceil(filteredPosts.length / postsPerPage);


    //  검색  
    const handleSearch = async (searchTerm: string) => {
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
    
        setLoading(true);
    
        const response = await axios.get("http://localhost:8001/community/posts/search", {
          params: {
            keyword: searchTerm,
            page: currentPage,
            size: postsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
  	   validateStatus: (status) => {
          return status >= 200 && status < 500; 
        },
        });
    
        console.log("response type", typeof response.data);
    
        if (response.status === 200) {
          const fetchedPosts = response.data.posts;
          if (!fetchedPosts || fetchedPosts.length === 0) {
            setPosts([]);
            alert("검색 결과가 없습니다.");
          } else {
            //오류 방지
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
            setIsSearchActive(true);
          }
        }else if (response.status === 404) {
       console.error("검색 결과가 없습니다: ", response.statusText);
       alert("검색 결과가 없습니다.");
       setPosts([]);
    } else if (response.status >= 400) {
         console.error("검색 결과를 가져오는 중 오류 발생: ", response.statusText);
         alert("검색 결과를 가져오던 중 오류가 발생했습니다.");
        setPosts([]);
   }
      } catch (error) {
        console.error("서버와의 통신 중 오류 발생:", error);
        alert("서버와의 통신에서 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    const handleKeywordClick = async (keyword: string) => {
      console.log("키워드  : ", keyword);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("로그인 토큰이 없습니다.");
          return;
        }
    
        setLoading(true);
    
        const response = await axios.get(`http://localhost:8001/community/posts/sport/${keyword}`, {
          params: {
            page: currentPage,
            size: postsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("response", response.status);
    
        if (response.status === 200) {
          const fetchedPosts = response.data.searchList;
          if (!fetchedPosts || fetchedPosts.length === 0) {
            setPosts([]);
            alert("검색 결과가 없습니다.");
          } else {
            setPosts(fetchedPosts);
            setIsSearchActive(true);
          }
        } else {
          console.error("키워드 검색 결과를 가져오는 중 오류 발생:", response.statusText);
          alert("키워드 검색 결과를 가져오던 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("서버와의 통신 중 오류 발생:", error);
        alert("서버와의 통신에서 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

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
        onCommentDelete={handleCommentDelete}
        currentUserNickname={""}
        // comments={postComments}
        comments={comments}  
        onAddComment={(content) => handleCommentSubmit(selectedPost.post_id, content)}
        onCommentReaction={handleCommentReaction}
      />
    );
  }

  /* 메인 화면 렌더링 */
  return (
    <div className="community-container">
    {/* 카테고리(대,소분류) 드롭다운으로 교체 */}
    {!showPostForm && (
      <CategoryDropdown
        post_up_sports={post_up_sports}
        activeTab={activeTab}
        activePost_sport={activePost_sport}
        onTabChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
      />
    )}

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
         <RecommendedKeywords 
                        keywords={recommendedKeywords} 
                        onKeywordClick={handleKeywordClick}
           /> 

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
          <PostList posts={currentPosts} recommendedPosts={recommendedPosts}  onPostClick={handlePostClick} />

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
