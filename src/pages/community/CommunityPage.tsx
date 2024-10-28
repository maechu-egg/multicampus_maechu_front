import React, { useState } from "react";
import PostList from "./communityComponent/PostList";
import PostForm from "./communityComponent/PostForm";
import PostDetail from "./communityComponent/PostDetail";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CommunityPage.css";

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  likeCount: number;
  dislikeCount: number;
}

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
}

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState("헬스");
  const [searchTerm, setSearchTerm] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const categories = ["헬스", "필라테스", "크로스핏", "런닝", "요가"];

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const handleSavePost = (title: string, content: string, category: string, subcategory: string, tags: string[]) => {  // subcategory 추가
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
      likeCount: 0
    };
    setPosts([...posts, newPost]);
    setShowPostForm(false);
  };
  

  const handleEdit = () => {
    setIsEditing(true);
  };

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

  const handlePostClick = (post: Post) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === post.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });
    
    setPosts(updatedPosts);
    setSelectedPost({ ...post, views: post.views + 1 });
  };

  const handleBack = () => {
    setSelectedPost(null);
    setIsEditing(false);
  };

 
  const handleAddComment = (postId: number, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment: Comment = {
      id: comments.length + 1,
      postId,
      author: "작성자",
      content,
      date: formattedDate,  
      likeCount: 0,
      dislikeCount: 0
    };
    setComments([...comments, newComment]);
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleCommentReaction = (commentId: number, type: 'like' | 'dislike') => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likeCount: type === 'like' ? comment.likeCount + 1 : comment.likeCount,
          dislikeCount: type === 'dislike' ? comment.dislikeCount + 1 : comment.dislikeCount
        };
      }
      return comment;
    }));
  };

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
      />
    );
  }

  const handleDelete = () => {
    if (selectedPost && window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setSelectedPost(null);
    }
  };
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

  const filteredPosts = posts.filter(post => post.category === activeTab);

  return (
    <div className="community-container">
      <div className="tab-container">
        <Nav variant="tabs" className="justify-content-center mb-4">
          {categories.map((category) => (
            <Nav.Item key={category}>
              <Nav.Link
                active={activeTab === category}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {showPostForm ? (
        <PostForm
          mode="create"
          onSave={handleSavePost}
          onCancel={() => setShowPostForm(false)}
        />
      ) : (
        <>
          <div className="search-and-write">
            <div className="search-bar">
              <input
                type="text"
                className="form-control"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary">
                <i className="bi bi-search"></i>
                검색
              </button>
            </div>
            <button className="btn btn-primary write-button" onClick={handleCreatePost}>
              게시물 작성
            </button>
          </div>
          <PostList posts={filteredPosts} onPostClick={handlePostClick} />
        </>
      )}
    </div>
  );
}

export default CommunityPage;