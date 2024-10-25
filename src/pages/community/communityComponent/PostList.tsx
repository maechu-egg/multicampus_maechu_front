// PostList.tsx
import React from "react";
import PostItem from "./PostItem";

interface Post {
  id: number;
  title: string;
  content: string; 
  author: string;
  date: string;
  views: number;
  comments: number;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void; 
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content} 
          author={post.author}
          date={post.date}
          views={post.views}
          comments={post.comments}
          onClick={() => onPostClick(post)} 
        />
      ))}
    </div>
  );
};

export default PostList;
