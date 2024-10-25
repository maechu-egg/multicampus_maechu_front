import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Modal.css';
import CrewBattleFeedCard from "../card/CrewBattleFeedCard";
import CrewBattleFeedContentCard from "../card/CrewBattleFeedContentCard";

function CrewBattleFeedDetailModal(): JSX.Element {
    return (
        <div className="d-flex">
            <div className="left-panel flex-shrink-0" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                {/* 
                    반복문으로 멤버카드 보여주고 멤버카드 클릭 이벤트 넣어서 멤버와 배틀정보가 같은 피드를
                    보여주는 방식
                */}
                <div className="scrollable-content">
                    {/* 첫번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                    {/* 두번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                    {/* 세번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                    {/* 네번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />  
                    {/* 다섯번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                    {/* 여섯번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                    {/* 일곱번째 멤버 */}
                    <CrewBattleFeedCard/>
                    <hr />
                </div>
            </div>
            {/*
                
            */}
            <div className="right-panel" style={{ width: '100%', overflowY: 'auto', maxHeight: '100vh' }}>
                {/* 첫번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
                {/* 두번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
                {/* 세번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
                {/* 네번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
                {/* 다섯번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
                {/* 여섯번째 피드*/}
                <CrewBattleFeedContentCard />
                <hr />
            </div>
        </div>
    );
}

export default CrewBattleFeedDetailModal;
