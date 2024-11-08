import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import api from 'services/api/axios';
import { useAuth } from "context/AuthContext";

interface CrewPostListProps {
    crew: any;
    onCrewClick?: (crewId: any) => void;
}

const CrewPostList: React.FC<CrewPostListProps> = ({ crew, onCrewClick }) => {
    const [crewMember, setCrewMember] = useState(0);
    const { state } = useAuth();
    const token = state.token;
    const [writer, setWriter] = useState("");
    useEffect(() => {
        const getCrewMember = async() => {
            try {
                const response = await api.get(`crew/member/list/${crew.crew_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> getCrewMember response", response.data);
                setCrewMember(response.data.length);
                for(let i = 0; i < response.data.length; i++) {
                    if(response.data[i].member_id === crew.member_id) {
                        setWriter(response.data[i].nickname);
                    }
                }
            } catch (error) {
                console.error("debug >>> getCrewMember error", error);
            }
        }
        getCrewMember();
    }, [crew]);

    const formattedCrewDate = new Date(crew.crew_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="post-item" onClick={() => onCrewClick && onCrewClick(crew.crew_id)}
            data-bs-toggle="modal"
            data-bs-target="#crewJoinModal">
            <div className="post-content-wrapper">
                <span className="subcategory">{crew.crew_sport}</span>
                &nbsp;
                <span className="post-title">{crew.crew_title}</span>
                <span className="local">{crew.crew_location}</span>
                <span className="author">{writer}</span>
                <span className="date">{formattedCrewDate}</span>
                <div className="post-stats">
                    <span className="likes">
                        <FaUser /> {crewMember}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CrewPostList;
    