import React from "react";
import { FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
import "./CrewPostItem.css";

interface PostItemProps {
    crew_post_id: number;
    crew_post_title: string;
    crew_post_contents: string;
    crwe_post_img: string;
    crew_post_like: number;
    crew_post_state: number;
    crew_post_date : string;
    crew_id: number;
    member_id: number;
    nickname: string;
    onClick: () => void;
}

const CrewPostItem: React.FC<PostItemProps> = ({
    crew_post_id,
    crew_post_title,
    crew_post_contents,
    crwe_post_img,
    crew_post_like,
    crew_post_state,
    crew_post_date,
    nickname,
    onClick
}) => {


  return (
    <div className="post-item"  onClick={onClick}>
        <div className="post-content-wrapper">
            <span className="post-title">{crew_post_title}</span>        
            <div className="post-info-wrapper">
                <div className="author">
                    <span>{nickname}</span>
                </div>
                <div className="post-stats">
                    <span className="date">{crew_post_date}</span>
                    <span className="likes">
                        <FaThumbsUp /> {crew_post_like}
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CrewPostItem;