import React from "react";
import PostItem from "./PostItem";
import RecommendedPostsItem from "./RecommendedPostsItem";
import styled from "styled-components";
import "./RecommendedPostsItem.css"; 

/* 게시물 목록을 표시하는 컴포넌트 */
interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  comment_like_status: boolean;
  comment_dislike_status: boolean;
  commentAuthor: boolean;
}

interface Post {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments_count: number;
  comments: Comment[];
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword: string;
  post_hashtag: string;
  post_like_counts: number;
  isRecommended?: boolean;
  likeStatus: boolean;
  unlikeStatus: boolean;
  post_img1: string;
  post_img2: string;
  post_unlike_counts: number;
  member_id: number;

  author: boolean;
}

interface PostListProps {
  posts: Post[];
  recommendedPosts?: Post[];
  onPostClick: (post: Post, isRecommended: boolean) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  recommendedPosts,
  onPostClick,
}) => {
  return (
    <div className="postlist_wrap">
      {recommendedPosts && recommendedPosts.length > 0 && (
        <RecommendedSection>         
          <ScrollContainer>
            {recommendedPosts.map((post) => (
              <RecommendedPostsItem
                key={post.post_id}
                {...post}
                onClick={() => onPostClick(post, true)}
                isRecommended={true}
              />
            ))}
          </ScrollContainer>
        </RecommendedSection>
      )}

      <h3 className="list_title">전체 게시글</h3>
      {posts.length === 0 ? (
        <p className="non_post">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post.post_id}
            {...post}
            onClick={() => onPostClick(post, false)}
            isRecommended={false}
          />
        ))
      )}
    </div>
  );
};

const RecommendedSection = styled.div`
  margin: 0 auto 24px auto; 
  width: 100%;  
  max-width: 1200px; 
`;


const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 16px 0;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  user-select: none;
  width: 100%;

  &:active {
    cursor: grabbing;
  }
  
  /* 스크롤바 기본 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    display: none;  /* 기본적으로 숨김 */
  }
  
  /* 호버 시 스크롤바 표시 */
  &:hover::-webkit-scrollbar {
    display: block;  /* 호버 시에만 표시 */
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ABC7FF;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #8BA7DF;
  }
`;


export default PostList;
