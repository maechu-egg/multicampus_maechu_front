import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
import "./PostItem.css";
import { formatDate } from '../../../utils/dateFormat'; 
import ProfileModal from "./ProfileModal";
import axios from "axios";

/* 개별 게시물 항목을 표시하는 컴포넌트 */
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

interface PostItemProps {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  comments:  Comment[];
  comments_count:number;
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword:string;
  post_hashtag: string;
  post_like_counts: number;
  likeStatus :boolean;
  personal_badge?: string;  // 개인 뱃지 레벨
  crew_badge?: string;   
  isRecommended?: boolean; 
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
  onClick: () => void;
  member_id : number;
}

const badgeImages: { [key: string]: string } = {
  다이아몬드: '/img/personalBadge/badgeDiamond.png',
  플래티넘: '/img/personalBadge/badgePlatinum.png',
  골드: '/img/personalBadge/badgeGold.png',
  실버: '/img/personalBadge/badgeSilver.png',
  브론즈: '/img/personalBadge/badgeBronze.png',
  기본: '/img/personalBadge/badgeDefault.png',
};

const getBadgeImage = (level: string): string => {
  return badgeImages[level] || badgeImages['기본'];
};
const BASE_URLI = "https://workspace.kr.object.ncloudstorage.com/";
const PostItem: React.FC<PostItemProps> = ({
  post_title,
  post_nickname,
  post_date,
  post_views,
  comments_count ,
  comments,
  post_sport,
  post_like_counts,
  post_hashtag,
  likeStatus,
  isRecommended, 
  personal_badge,
  crew_badge,
  member_badge_level,
  onClick,
  member_id,
}) => {

  // 해시태그 문자열을 쉼표와 공백(", ") 기준으로 나누어 배열로 변환
  const hashtagArray = post_hashtag ? post_hashtag.split(", ") : [];
  const badgeImage = getBadgeImage(member_badge_level);
 
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
    다이아몬드: '/img/crewBadge/crewBadgeDiamond.png',
    플래티넘: '/img/crewBadge/crewBadgePlatinum.png',
    골드: '/img/crewBadge/crewBadgeGold.png',
    실버: '/img/crewBadge/crewBadgeSilver.png',
    브론즈: '/img/crewBadge/crewBadgeBronze.png',
    기본: '/img/crewBadge/crewBadgeDefault.png',
  };
  const getMBadgeImage = (level: string): string => {
    return MamberBadgeImages[level] || badgeImages['기본'];
  };
  const getCBadgeImage = (level: string): string => {
    return CrowBadgeImages[level] || badgeImages['기본'];
  };
  const MamberBadgeImage = getMBadgeImage(personalLevel);
  const CrowBadgeImage = getCBadgeImage(crewLevel)

  const handleProfileClick = async () => {

    try {

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
  
      const response = await axios.get(`http://localhost:8001/community/posts/showprofile`, {
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
      setIsModalOpen(true);
    } catch (error) {
      console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className={`post-item ${isRecommended ? 'recommended' : ''}`}>
      <div className="post-content-wrapper">
      <ProfileModal
        isProfileOpen={isModalOpen}
        onProfileClose={handleCloseModal}
        profileImage={profileImage} // 동적 URL로 대체
        nickname={post_nickname}
        personalBadge={MamberBadgeImage || "/img/defaultPersonalBadge.png"}
        crewBadge={CrowBadgeImage || "/img/defaultCrewBadge.png"}
      />
        {/* <div className="category-date-line">
          <span className="subcategory">[{post_sport || '자유'}]</span>
          <span className="date">{formatDate(post_date)}</span>
        </div>
        
        <div className="title-author-line">
          <span className="post-title">{post_title}</span>
          <span className="author">{post_nickname}</span>
        </div>
  
        <div className="post-info-wrapper">
          {hashtagArray.length > 0 && (
            <div className="post-tags">
              {hashtagArray.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="post-stats">
            <span className="likes">
              <FaThumbsUp /> {post_like_counts}
            </span>
            <span className="comments">
              <FaComment /> {comments_count}
            </span>
            <span className="views">
              <FaEye /> {post_views}
            </span>
          </div>
        </div> */}
        <input type="hidden" value={member_id} />
        <ul className="category-date-line">
          <li className="subcategory">[{post_sport || '자유'}]</li>
          <li className="post-titles"  onClick={onClick}>{post_title}</li>
          <li className="post_author" onClick={handleProfileClick} >{post_nickname}
            <img src={badgeImage} alt={`${member_badge_level} badge`} className="member_badge_img" />  
          </li>
          <li className="post-date">{formatDate(post_date)}</li>
        </ul>
  
        <div className="post-info-wrapper">
          <div className="tags_wrap">
          {hashtagArray.length > 0 && (
            <div className="post-tags">
              {hashtagArray.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
            </div>
          )}
          </div>
          <div className="post-status">
            <span className="likes">
              <FaThumbsUp /> {post_like_counts}
            </span>
            <span className="comments">
              <FaComment /> {comments_count}
            </span>
            <span className="views">
              <FaEye /> {post_views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;