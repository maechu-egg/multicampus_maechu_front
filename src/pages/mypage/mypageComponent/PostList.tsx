// PostList.tsx
import React from "react";
import styled from "styled-components";
import { useAuth } from "context/AuthContext";
import PostDetail from "pages/community/communityComponent/PostDetail";
import { useNavigate } from "react-router-dom";

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
interface PostData {
  postData: Post[];
}

function PostList({ postData }: PostData): JSX.Element {
  const { state } = useAuth();
  const { token } = state;
  const navigate = useNavigate();

  const handlePostClick = async (post: Post, isRecommended: boolean) => {
    console.log("Clicked post:", post);
    console.log("isRecommended:", isRecommended);
    
    const stateData = { 
      fromMyPage: true,
      selectedPost: post,
      isRecommended
    };
    
    console.log("Navigating with state:", stateData);
    
    try {
      navigate('/communitypage',{
        state: stateData,
        replace: true
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <Container>
      {postData.length > 0 ? (
        postData.map((post) => (
          <PostItem
            key={post.post_id}
            onClick={() => handlePostClick(post, post.isRecommended || false)}
          >
            <Title>{post.post_title}</Title>
            <Details>
              <span>👤 {post.post_nickname}</span> |{" "}
              <span>🏷️ {post.post_sport}</span> |{" "}
              <span>👁️ {post.post_views} views</span>
            </Details>
            <Content>{post.post_contents || "No content available."}</Content>
            <Footer>
              <span>👍 {post.post_like_counts}</span>
              <span>{new Date(post.post_date).toLocaleDateString()}</span>
            </Footer>
          </PostItem>
        ))
      ) : (
        <NoPosts>No posts available.</NoPosts>
      )}
    </Container>
  );
}

export default PostList;

const Container = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostItem = styled.div`
  border: 1px solid grey;
  border-radius: 8px;
  padding: 16px;
  margin: 0 20px;
  background: white;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
  }
`;

const Title = styled.h3`
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
`;

const Details = styled.div`
  font-size: 0.9em;
  color: #777;
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
`;

const Content = styled.p`
  font-size: 0.95em;
  color: #444;
  margin-bottom: 12px;
`;

const Footer = styled.div`
  font-size: 0.85em;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const NoPosts = styled.p`
  text-align: center;
  color: #999;
  font-size: 1em;
`;
