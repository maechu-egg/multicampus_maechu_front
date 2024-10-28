import React, { useState } from "react";
import CrewSearch from "./CrewSearch";
import MyCrewHeader from "./MyCrewHeader";
import './CrewPage.css';

function CrewHeader(): JSX.Element {
    const [activeCrewTab, setActiveCrewTab] = useState(0); // Active crew tab state

    const handleCrewTabClick = (index: number) => {
        setActiveCrewTab(index); // Update active tab index
    };

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
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeCrewTab === 1 ? 'active' : ''}`}
                        onClick={() => handleCrewTabClick(1)}
                        id="my-crew1" 
                        data-bs-toggle="tab" 
                        data-bs-target="#my-crew1-pane" 
                        type="button" 
                        role="tab" 
                        aria-controls="my-crew1-pane" 
                        aria-selected="true"
                    >
                        내 크루 1
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeCrewTab === 2 ? 'active' : ''}`}
                        onClick={() => handleCrewTabClick(2)}
                        id="my-crew2" 
                        data-bs-toggle="tab" 
                        data-bs-target="#my-crew2-pane" 
                        type="button" 
                        role="tab" 
                        aria-controls="my-crew2-pane" 
                        aria-selected="true"
                    >
                        내 크루 2
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
                        id="my-crew1-pane" 
                        role="tabpanel" 
                        aria-labelledby="my-crew1" 
                        tabIndex={0}
                    >
                        <br/>
                        <MyCrewHeader crewId={1} /> 
                    </div>
                )}
                {activeCrewTab === 2 && (
                    <div 
                        className="tab-pane fade show active"
                        id="my-crew2-pane" 
                        role="tabpanel" 
                        aria-labelledby="my-crew2" 
                        tabIndex={0}
                    >
                        <br/>
                        <MyCrewHeader crewId={26} /> 
                    </div>
                )}
            </div>
        </div>
    );
}

export default CrewHeader;
