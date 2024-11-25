// PostList.tsx
import React from "react";
import styled from "styled-components";
import { useAuth } from "context/AuthContext";
import PostDetail from "pages/community/communityComponent/PostDetail";
import { useNavigate } from "react-router-dom";
import { postApi } from "services/api/community/postApi";
import { useMediaQuery } from 'react-responsive';

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
  const isSmallScreen = useMediaQuery({ query: '(max-width: 579px)' });

  const handlePostClick = async (post: Post, isRecommended: boolean) => {
    try {
      if (!token) {
        console.error("No token available");
        return;
      }
  
      const response = await postApi.getPostDetail(
        post.post_id,
        post.author,
        token  
      );
      const detailedPost = response.data;
  
      const stateData = {
        fromMyPage: true,
        selectedPost: detailedPost,
        isRecommended,
      };
  
      navigate("/communitypage", {
        state: stateData,
        replace: true,
      });
    } catch (error) {
      console.error("Error fetching post details:", error);
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
              <Nickname>👤 {post.post_nickname}</Nickname> |{" "}
              <SubSport>🏷️ {post.post_sport}</SubSport>
              {/* 579px 이하일 때만 조회수를 해시태그와 같은 줄에 표시 */}
              {isSmallScreen ? null : <ViewCount> | 👁️ {post.post_views} views</ViewCount>}
            </Details>
            <TagViewContainer>
              <Hashtags>
                {post.post_hashtag &&
                  post.post_hashtag.split(",").map((hashtag, index) => (
                    <span key={index}>{hashtag.trim()}</span>
                  ))}
              </Hashtags>
              {isSmallScreen && <ViewCount>👁️ {post.post_views} views</ViewCount>}
            </TagViewContainer>
            <Footer>
              <LikeCount>👍 {post.post_like_counts}</LikeCount>
              <PostDate>{new Date(post.post_date).toLocaleDateString()}</PostDate>
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

const SubSport = styled.span`
  font-size:14px;
  @media(max-width:470px){
    font-size:12px;
  }
  @media(max-width:380px){
    font-size:10px;
    display:inline-block;
    overflow: hidden; /* 넘치는 내용 숨기기 */
    white-space: nowrap; /* 줄 바꿈 방지 */
    text-overflow: ellipsis; /* 생략 부호 표시 */
  }
`;

const TagViewContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 배치 */
  align-items: center; /* 세로 정렬 */
  margin-top: 8px; /* 필요에 따라 여백 추가 */
  overflow: hidden; /* 넘치는 내용 숨기기 */
`;

const Hashtags = styled.div`
  font-size: 0.85em;
  color: #6886ba;
  max-width: 40%; /* 부모 요소의 너비에 맞춤 */
  display:inline-block;
  overflow: hidden; /* 넘치는 내용 숨기기 */
  white-space: nowrap; /* 줄 바꿈 방지 */
  text-overflow: ellipsis; /* 생략 부호 표시 */

   @media(max-width:470px){
    font-size:13px;
    max-width:100px;
  }
  @media(max-width:380px){
    font-size:11.5px;
  }
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
  max-width: 200px; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media(max-width:470px){
    font-size:16px;
  }

  @media(max-width:380px){
    font-size:14px;
    max-width:160px;
  }
`;

const Details = styled.div`
  font-size: 0.9em;
  color: #777;
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
`;

const Footer = styled.div`
  font-size: 0.85em;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const LikeCount = styled.span`
   @media(max-width:470px){
    font-size:13px;
    max-width:100px;
  }
  @media(max-width:380px){
    font-size:11.5px;
  }
`;

const NoPosts = styled.p`
  text-align: center;
  color: #999;
  font-size: 1em;
`;

const Nickname = styled.span`
  display: inline-block;
  max-width: 150px; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media(max-width:470px){
    font-size:12px;
    max-width:100px;
  }

  @media(max-width:380px){
    font-size:10px;
    max-width:80px;
  }
`;

const ViewCount = styled.span`
  font-size: 0.80em;
  color: #6886ba;

  display: flex;
  justify-content: flex-end; 

   @media(max-width:470px){
    font-size:13px;
    max-width:100px;
  }
  @media(max-width:380px){
    font-size:11.5px;
  }
`;

const PostDate = styled.span`

 @media(max-width:470px){
    font-size:12px;
    max-width:100px;
  }
    @media(max-width:380px){
    font-size:10px;
    max-width:80px;
  }

`;
