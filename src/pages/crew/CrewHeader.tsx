import React, { useEffect, useState } from "react";
import CrewSearch from "./CrewSearch";
import './CrewPage.css';
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";
import MyCrew from "./MyCrew";

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
                        style={{fontSize: '30px'}}
                    >
                        Find Crew
                    </button>
                </li>
                
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeCrewTab === 1 ? 'active' : ''}`}
                        onClick={() => handleCrewTabClick(1)}
                        id="my-crew"
                        data-bs-toggle="tab"
                        data-bs-target="#my-crew-pane"
                        type="button"
                        role="tab"
                        aria-controls="my-crew-pane"
                        aria-selected="true"
                        style={{fontSize: '30px'}}
                    >
                        My Crew
                    </button>
                </li>
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
                {activeCrewTab === 1 && (
                    <div 
                        className="tab-pane fade show active"
                        id="my-crew-pane" 
                        role="tabpanel" 
                        aria-labelledby="my-crew" 
                        tabIndex={0}
                    >
                        <br/>
                        <MyCrew myCrew={myCrew}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CrewHeader;
