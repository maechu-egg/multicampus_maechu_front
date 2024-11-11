import React, { useState } from "react";
import './CrewPage.css';
import MyCrewHeader from "./MyCrewHeader";


function MyCrew({myCrew}: { myCrew: any }) {
    const [activeCrewTab, setActiveCrewTab] = useState(0); // Active crew tab state

    const handleCrewTabClick = (index: number) => {
        setActiveCrewTab(index); // Update active tab index
    };

    return(
        <div>
            <ul className="nav" id="myTab" role="tablist">
                {myCrew.map((crew: { crew_id: string; crew_name: string }, index: number) => (
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
                {myCrew.map((crew: { crew_id: string; crew_name: string }, index: number) => (
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
                            <MyCrewHeader crewId={parseInt(crew.crew_id)} /> 
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default MyCrew;