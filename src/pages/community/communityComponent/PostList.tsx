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
  category: string;
  subcategory: string;
  tags: string[];
  likeCount: number;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.id} {...post} onClick={() => onPostClick(post)} />
      ))}
    </div>
  );
};

export default PostList;