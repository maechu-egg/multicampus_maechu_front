import React from "react";
import { FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
import "./PostItem.css";

/* 개별 게시물 항목을 표시하는 컴포넌트 */

interface PostItemProps {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  category: string;
  subcategory: string;
  tags: string[];
  likeCount: number;
  isRecommended?: boolean; 
  onClick: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  title,
  author,
  date,
  views,
  comments,
  subcategory,
  likeCount,
  isRecommended, 
  onClick
}) => {
  return (
    <div className={`post-item ${isRecommended ? 'recommended' : ''}`} onClick={onClick}>
      <div className="post-content-wrapper">
        <span className="subcategory">[{subcategory || '자유'}]</span>
        <span className="post-title">{title}</span>
        <span className="author">{author}</span>
        <span className="date">{date}</span>
        <div className="post-stats">
          <span className="likes">
            <FaThumbsUp /> {likeCount}
          </span>
          <span className="comments">
            <FaComment /> {comments}
          </span>
          <span className="views">
            <FaEye /> {views}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;