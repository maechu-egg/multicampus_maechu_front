import React from "react";
import PostItem from "./PostItem";

/* 게시물 목록을 표시하는 컴포넌트 */

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