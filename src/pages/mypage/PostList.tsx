// PostList.tsx
import React from "react";
import styled from "styled-components";

interface PostListProps {
  postData: {
    post_id: number;
    post_title: string;
    post_nickname: string;
    post_sport: string;
    post_views: number;
    post_like_counts: number;
    post_date: string;
    post_contents: string | null;
  }[];
}

function PostList({ postData }: PostListProps): JSX.Element {
  return (
    <Container>
      {postData.length > 0 ? (
        postData.map((post) => (
          <PostItem key={post.post_id}>
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
  background: white;
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
