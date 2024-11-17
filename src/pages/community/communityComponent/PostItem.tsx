import React from "react";
import { FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
import "./PostItem.css";
import { formatDate } from '../../../utils/dateFormat'; 

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
  onClick: () => void;
}

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
  onClick
}) => {

  // 해시태그 문자열을 쉼표와 공백(", ") 기준으로 나누어 배열로 변환
  const hashtagArray = post_hashtag ? post_hashtag.split(", ") : [];


  return (
    <div className={`post-item ${isRecommended ? 'recommended' : ''}`} onClick={onClick}>
      <div className="post-content-wrapper">
        <div className="category-date-line">
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
        </div>
      </div>
    </div>
  );
};

export default PostItem;