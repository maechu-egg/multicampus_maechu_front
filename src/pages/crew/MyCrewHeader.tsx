import React, { useState } from "react";
import CrewInfo from "./myCrew/CrewInfo";
import CrewMemberInfo from "./myCrew/CrewMemberInfo";
import CrewPost from "./myCrew/CrewPost";
import CrewBattle from "./myCrew/CrewBattle";
import './CrewPage.css';

interface MyCrewHeaderProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function MyCrewHeader({ crewId }: MyCrewHeaderProps): JSX.Element {
    const [activeTab, setActiveTab] = useState('crew-info'); // 기본적으로 '크루 소개' 탭을 활성화합니다.

    const handleTabClick = (tab: string) => {
        setActiveTab(tab); // 클릭한 탭으로 활성화 상태를 변경합니다.
    };

    return (
        <div className="container back">
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${activeTab === 'crew-info' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('crew-info')}
                        id="crew-info-tab" 
                        data-bs-toggle="pill" 
                        data-bs-target="#crew-info" 
                        type="button" 
                        role="tab" 
                        aria-controls="crew-info" 
                        aria-selected="true"
                    >
                        크루 소개
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${activeTab === 'crew-person-info' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('crew-person-info')}
                        id="crew-member-info-tab" 
                        data-bs-toggle="pill" 
                        data-bs-target="#crew-member-info" 
                        type="button" 
                        role="tab" 
                        aria-controls="crew-member-info" 
                        aria-selected="true"
                    >
                        크루원 정보
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${activeTab === 'crew-post' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('crew-post')}
                        id="crew-post-tab" 
                        data-bs-toggle="pill" 
                        data-bs-target="#crew-post" 
                        type="button" 
                        role="tab" 
                        aria-controls="crew-post" 
                        aria-selected="true"
                    >
                        크루 게시판
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button 
                        className={`nav-link ${activeTab === 'crew-battle' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('crew-battle')}
                        id="crew-battle-tab" 
                        data-bs-toggle="pill" 
                        data-bs-target="#crew-battle" 
                        type="button" 
                        role="tab" 
                        aria-controls="crew-battle" 
                        aria-selected="true"
                    >
                        배틀 현황
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div 
                    className={`tab-pane fade ${activeTab === 'crew-info' ? 'show active' : ''}`}
                    id="crew-info"
                    role="tabpanel" 
                    aria-labelledby="crew-info-tab" 
                    tabIndex={0}
                >
                    <CrewInfo crewId={crewId} /> {/* 크루 ID를 CrewInfo에 전달 */}
                </div>
                <div 
                    className={`tab-pane fade ${activeTab === 'crew-person-info' ? 'show active' : ''}`}
                    id="crew-member-info"
                    role="tabpanel" 
                    aria-labelledby="crew-member-info-tab" 
                    tabIndex={0}
                >
                    <CrewMemberInfo /> {/* 크루 ID를 CrewMemberInfo에 전달 */}
                </div>
                <div 
                    className={`tab-pane fade ${activeTab === 'crew-post' ? 'show active' : ''}`}
                    id="crew-post"
                    role="tabpanel" 
                    aria-labelledby="crew-post-tab" 
                    tabIndex={0}
                >
                    <CrewPost crewId={crewId} /> {/* 크루 ID를 CrewPost에 전달 */}
                </div>
                <div 
                    className={`tab-pane fade ${activeTab === 'crew-battle' ? 'show active' : ''}`}
                    id="crew-battle"
                    role="tabpanel" 
                    aria-labelledby="crew-battle-tab" 
                    tabIndex={0}
                >
                    <CrewBattle crewId={crewId} /> {/* 크루 ID를 CrewBattle에 전달 */}
                </div>
            </div>
        </div>
    );
}

export default MyCrewHeader;
