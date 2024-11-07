import React from "react";
import PostItem from "./PostItem";

/* 게시물 목록을 표시하는 컴포넌트 */

interface Post {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments_count :number;
  // comments: number;
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword:string;
  post_hashtag: string;
  post_like_counts: number;
  isRecommended?: boolean;
  likeStatus :boolean;
  unlikeStatus:boolean;
  post_img1:string;
  post_img2:string;
  post_unlike_counts : number;
  member_id: number; 
  commets_count:number;
  author:boolean;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  console.log("PostList posts : ", posts);
  return (
    <div>
    {posts.length === 0 ? (
      <p>게시글이 없습니다.</p>
    ) : (
      posts.map((post) => (
        <PostItem key={post.post_id} {...post} onClick={() => onPostClick(post)} />
      ))
    )}
  </div>
  );
};

export default PostList;