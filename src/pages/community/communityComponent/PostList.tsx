import React from "react";
import PostItem from "./PostItem";
import RecommendedPostsItem from "./RecommendedPostsItem";
import styled from "styled-components";


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
    <div>
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

      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
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
  margin: 0 auto 24px auto; /* 상하 마진 24px, 좌우 auto로 중앙 정렬 */
  width: 70%;  /* 전체 너비의 70%만 차지 */
  max-width: 1200px; /* 너무 커지지 않도록 최대 너비 설정 */
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 16px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default PostList;
