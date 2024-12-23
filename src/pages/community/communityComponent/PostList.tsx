import React, { useState } from "react";
import PostItem from "./PostItem";
import RecommendedPostsItem from "./RecommendedPostsItem";
import styled from "styled-components";
import "./RecommendedPostsItem.css"; 
import ProfileModal from "./ProfileModal";
import api from '../../../services/api/axios';
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
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;

}

interface PostListProps {
  posts: Post[];
  recommendedPosts?: Post[];
  onPostClick: (post: Post, isRecommended: boolean) => void;
}

const BASE_URLI = "https://workspace.kr.object.ncloudstorage.com/";
const PostList: React.FC<PostListProps> = ({
  posts,
  recommendedPosts,
  onPostClick,
}) => {  
  // 드래그 스크롤 기능을 위한 상태 추가
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 조절
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [nickname, setNickname] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [personalPoints, setPersonalPoints] = useState(0);
  const [crewPoints, setCrewPoints] = useState(0);
  const [personalLevel, setPersonalLevel] = useState("기본");
  const [crewLevel, setCrewLevel] = useState("기본");
  const getLevelLabel = (points: number) => {
    if (points >= 100) return "다이아몬드";
    if (points >= 70) return "플래티넘";
    if (points >= 50) return "골드";
    if (points >= 30) return "실버";
    if (points >= 10) return "브론즈";
    return "기본";
  };

  const MamberBadgeImages: { [key: string]: string } = {
    다이아몬드: '/img/personalBadge/badgeDiamond.png',
    플래티넘: '/img/personalBadge/badgePlatinum.png',
    골드: '/img/personalBadge/badgeGold.png',
    실버: '/img/personalBadge/badgeSilver.png',
    브론즈: '/img/personalBadge/badgeBronze.png',
    기본: '/img/personalBadge/badgeDefault.png',
  };
  const CrowBadgeImages: { [key: string]: string } = {
    다이아몬드: '/img/crewBadge/CrewBadgeDiamond.png',
    플래티넘: '/img/crewBadge/CrewBadgePlatinum.png',
    골드: '/img/crewBadge/CrewBadgeGold.png',
    실버: '/img/crewBadge/CrewBadgeSilver.png',
    브론즈: '/img/crewBadge/CrewBadgeBronze.png',
    기본: '/img/crewBadge/CrewBadgeDefault.png',
  };
  const getMBadgeImage = (level: string): string => {
    return MamberBadgeImages[level] || MamberBadgeImages['기본'];
  };
  const getCBadgeImage = (level: string): string => {
    return CrowBadgeImages[level] || CrowBadgeImages['기본'];
  };
  const MamberBadgeImage = getMBadgeImage(personalLevel);
  const CrowBadgeImage = getCBadgeImage(crewLevel)

  const handleProfileClick = async (member_id:number, post_nickname:string) => {

    try {

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
  
      const response = await api.get(`/community/posts/showprofile`, {
        params: {
          member_id: member_id, // 쿼리 파라미터로 전달
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { member_img, current_points, crew_current_points } = response.data;
      setProfileImage(`${BASE_URLI}${member_img}`);
      setPersonalPoints(current_points);
      setCrewPoints(crew_current_points);
      setPersonalLevel(getLevelLabel(current_points));
      setCrewLevel(getLevelLabel(crew_current_points));
      setNickname(post_nickname);
      setIsModalOpen(true);
    } catch (error) {
      console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleBadgeInfo = async (member_id: number): Promise<string> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return "기본";  // 토큰이 없을 때도 문자열 반환
      }

      const response = await api.get(`/community/posts/showprofile`, {
        params: {
          member_id: member_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { current_points } = response.data;
      const level = getLevelLabel(current_points);
      return level || "기본";  // undefined가 반환되지 않도록 보장
    } catch (error) {
      console.error("뱃지 데이터를 가져오는 중 오류 발생:", error);
      return "기본";
    }
  };

  return (
    <div className="postlist_wrap">
      {recommendedPosts && recommendedPosts.length > 0 && (
        <RecommendedSection>         
          <ScrollContainer
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {recommendedPosts.slice(0, 5).map((post) => (
              <RecommendedPostsItem
                key={post.post_id}
                {...post}
                onClick={() => !isDragging && onPostClick(post, true)}
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
            onProfileClick={(member_id: number, post_nickname: string) =>
              handleProfileClick(member_id, post_nickname)
            }
            onBadgeInfo={handleBadgeInfo}
            onClick={() => onPostClick(post, false)}
            isRecommended={false}
          />
        ))
      )}
      {isModalOpen &&(
        <ProfileModal
          isProfileOpen={isModalOpen}
          onProfileClose={handleCloseModal}
          profileImage={profileImage} // 동적 URL로 대체
          nickname={nickname}
          personalBadge={MamberBadgeImage || "/img/defaultPersonalBadge.png"}
          crewBadge={CrowBadgeImage || "/img/defaultCrewBadge.png"}
      />
      )

      }
    </div>
  );
};

const RecommendedSection = styled.div`
   margin: 0 auto 24px auto; 
  width: 100%;  
  max-width: 1200px;
  position: relative;
  display: flex;
  justify-content: center;  /* 중앙 정렬 추가 */
  
  /* hover 효과 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.01);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  /* hover 시 부드러운 그림자 효과 추가 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 15px rgba(171, 199, 255, 0.1);
  }

  @media(max-width: 1024px){
    .post-item.recommended{
      margin:5px;
    }
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 20px 10px;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  user-select: none;
  max-width:1200px;
  position: relative;
  justify-content: center;  /* 중앙 정렬 추가 */

  /* 컨테이너 내부 아이템들의 정렬 방식 설정 */
  & > * {
    flex: 0 0 auto;  /* 아이템들이 자신의 크기를 유지하도록 설정 */
  }

  /* 스크롤이 필요할 때만 좌우 정렬로 변경 */
  @media (max-width: 1200px) {
    justify-content: flex-start;
  }

  /* 페이드 효과 - 1260px 미만일 때만 적용 */
  @media (max-width: 1259px) {
    mask-image: linear-gradient(
      to right,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }


  &:active {
    cursor: grabbing;
  }

  /* 드래그 중일 때 텍스트 선택 방지 */
  * {
    user-select: none;
    -webkit-user-drag: none;
  }

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 6px;
    display: none;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    margin: 0 35%;  /* 스크롤바 트랙 길이를 더 줄임 (양쪽 35%씩 여백) */
  }

  &::-webkit-scrollbar-track:before {
    content: '';
    display: block;
    margin: 0 35%;  /* 트랙 내부 여백도 추가 */
  }

  &::-webkit-scrollbar-thumb {
    background: #ABC7FF;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    max-width: 30%;  /* 썸네일 최대 길이 제한 */
    margin: 0 35%;   /* 썸네일 위치 조정 */
    
    &:hover {
      background: #8BA7DF;
    }
  }

  /* 드래그 중일 때만 스크롤바 표시 */
  &:active {
    &::-webkit-scrollbar {
      display: block;
    }
    
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      opacity: 1;
      visibility: visible;
    }
  }
     @media (max-width: 1024px) {
    gap:0px;
    .post-item.recommended{
      padding
    }
  }
`;

export default PostList;
