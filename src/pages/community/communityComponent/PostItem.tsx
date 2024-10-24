// PostItem.tsx
import React from "react";
import "./PostItem.css";

interface Post {
  id: number;
  title: string;
  content: string; 
  author: string;
  date: string;
  views: number;
  comments: number;
}

interface PostItemProps extends Post {
  onClick: () => void; //
}

const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  author,
  date,
  views,
  comments,
  onClick 
}) => {
  return (
    <div className="post-item" onClick={onClick}>
      <h3 className="post-title">{title}</h3>
      <div className="post-info">
        <span className="post-author">{author}</span>
        <span className="post-date">({date})</span>
      </div>
      <div className="post-stats">
        <span className="post-views">조회수: {views}</span>
        <span className="post-comments">댓글: {comments}</span>
      </div>
    </div>
  );
};

export default PostItem;
