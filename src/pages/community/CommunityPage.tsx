// CommunityPage.tsx
import React, { useState } from "react";
import PostList from "./communityComponent/PostList";
import PostForm from "./communityComponent/PostForm";
import PostDetail from "./communityComponent/PostDetail";

interface Post {
  id: number;
  title: string;
  content: string; // 내용 속성이 포함되어 있어야 합니다.
  author: string;
  date: string;
  views: number;
  comments: number;
}

function CommunityPage(): JSX.Element {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // 선택된 게시물 상태 추가

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const handleSavePost = (title: string, content: string) => {
    const newPost: Post = {
      id: posts.length + 1, // 임시 ID 생성
      title,
      content, 
      author: "작성자", 
      date: new Date().toLocaleDateString(), // 현재 날짜
      views: 0,
      comments: 0,
    };
    setPosts([...posts, newPost]); // 새로운 게시물 추가
    setShowPostForm(false);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post); // 선택된 게시물 설정
  };

  const handleBack = () => {
    setSelectedPost(null); // 상세 페이지에서 뒤로 가기
  };

  if (selectedPost) {
    return (
      <PostDetail
        title={selectedPost.title}
        content={selectedPost.content}
        author={selectedPost.author}
        date={selectedPost.date}
        onBack={handleBack} //
      />
    );
  }

  return (
    <div>
      <h1>운동 커뮤니티</h1>
      {!showPostForm && (
        <button className="btn btn-primary" onClick={handleCreatePost}>
          게시물 작성
        </button>
      )}
      {showPostForm && (
        <PostForm mode="create" onSave={handleSavePost} onCancel={() => setShowPostForm(false)} />
      )}
      <PostList posts={posts} onPostClick={handlePostClick} />
    </div>
  );
}

export default CommunityPage;
