import React, { useEffect } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
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
    comment_count: number;
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
    comment_count,
    onClick
}) => {

    return (
        <div 
            className="post-item"  
            onClick={onClick}
            style={{
                border: crew_post_state === 0 
                    ? "2px solid #1D2636" 
                    : crew_post_state === 1 
                    ? "2px solid #780016" 
                    : undefined,
                boxShadow: crew_post_state === 0 
                    ? "0 0 5px 1px #1D2636" 
                    : crew_post_state === 1 
                    ? "0 0 5px 1px #780016" 
                    : undefined,

                
            }}
        >
            <div className="post-content-wrapper">
                <span className="post-title">{crew_post_title} <span className="badge text-bg-secondary">{crew_post_state === 0 ? "공지" : crew_post_state === 1 ? "인기" : ""}</span></span>        
                <div className="post-info-wrapper">
                    <div className="author">
                        <span>{nickname}</span>
                    </div>
                    <div className="post-stats">
                        <span className="date">{crew_post_date}</span>
                        <span className="likes">
                            <FaThumbsUp /> {crew_post_like}
                        </span>
                        <span className="comments">
                            <FaComment /> {comment_count}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrewPostItem;