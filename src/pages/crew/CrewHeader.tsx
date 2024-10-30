import React, { useEffect, useState } from "react";
import CrewSearch from "./CrewSearch";
import MyCrewHeader from "./MyCrewHeader";
import './CrewPage.css';
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";

function CrewHeader(): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;
    const [activeCrewTab, setActiveCrewTab] = useState(0); // Active crew tab state
    const [myCrew, setMyCrew] = useState<{ crew_id: number, crew_name: string }[]>([]);

    const handleCrewTabClick = (index: number) => {
        setActiveCrewTab(index); // Update active tab index
    };

    useEffect(() => {
        const getMyCrew = async() => {
            try {
                const response = await api.get(`crew/my?member_id=${memberId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> getMyCrew response", response.data);
                setMyCrew(response.data);
            } catch (error) {
                console.log("debug >>> getMyCrew error", error);
            }
        }
        getMyCrew();
    }, [memberId]);

    return (
        <div className="container">
            <br />
            <br />
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeCrewTab === 0 ? 'active' : ''}`}
                        onClick={() => handleCrewTabClick(0)}
                        id="crew-search" 
                        data-bs-toggle="tab" 
                        data-bs-target="#crew-search-pane" 
                        type="button" 
                        role="tab" 
                        aria-controls="crew-search-pane" 
                        aria-selected="true"
                    >
                        크루 찾기
                    </button>
                </li>
                {myCrew.map((crew, index) => (
                    <li className="nav-item" role="presentation" key={crew.crew_id}>
                        <button
                            className={`nav-link ${activeCrewTab === index + 1 ? 'active' : ''}`}
                            onClick={() => handleCrewTabClick(index + 1)}
                            id={`my-crew${index + 1}`}
                            data-bs-toggle="tab"
                            data-bs-target={`#my-crew${index + 1}-pane`}
                            type="button"
                            role="tab"
                            aria-controls={`my-crew${index + 1}-pane`}
                            aria-selected={activeCrewTab === index + 1}
                        >
                            {crew.crew_name}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content" id="myTabContent">
                {activeCrewTab === 0 && (
                    <div 
                        className="tab-pane fade show active"
                        id="crew-search-pane" 
                        role="tabpanel" 
                        aria-labelledby="crew-search" 
                        tabIndex={0}
                    >
                        <br/>
                        <CrewSearch />
                    </div>
                )}
                {myCrew.map((crew, index) => (
                    activeCrewTab === index + 1 && (
                        <div 
                            className="tab-pane fade show active"
                            id={`my-crew${index + 1}-pane`} 
                            role="tabpanel" 
                            aria-labelledby={`my-crew${index + 1}`} 
                            tabIndex={0}
                            key={crew.crew_id}
                        >
                            <br/>
                            <MyCrewHeader crewId={crew.crew_id} /> 
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default CrewHeader;
