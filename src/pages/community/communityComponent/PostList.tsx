import React from "react";
import PostItem from "./PostItem";
import RecommendedPostsItem from "./RecommendedPostsItem";


/* 게시물 목록을 표시하는 컴포넌트 */
interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  comment_like_status:boolean;
  comment_dislike_status:boolean;
  commentAuthor:boolean;
}

interface Post {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments_count :number;
  comments:  Comment[];
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

  author:boolean;
}

interface PostListProps {
  posts: Post[];
  recommendedPosts?:Post[];
  onPostClick: (post: Post, isRecommended:boolean) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, recommendedPosts, onPostClick }) => {
  console.log("PostList posts : ", posts);
  return (
    <div>
      {recommendedPosts && recommendedPosts.length > 0  && (
        <>
          <h2>추천 게시글</h2>
          {recommendedPosts.map((post) => (
            <RecommendedPostsItem key={post.post_id} {...post} onClick={() => onPostClick(post, true)} isRecommended={true} />
          ))}
        </>
      )}

      {/* <h2>전체 게시글</h2> */}
        {posts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <PostItem key={post.post_id} {...post} onClick={() => onPostClick(post, false)} isRecommended={false} />
          ))
        )}
  </div>
  );
};

export default PostList;