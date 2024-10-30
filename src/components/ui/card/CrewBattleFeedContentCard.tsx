import React from "react";


interface Feed {
    feed_exTime: number;
    feed_img: string;
    feed_kcal: number;
    feed_post: string;
    feed_sport: string;
}

interface CrewBattleFeedContentCardProps {
    feed: Feed;
}

function CrewBattleFeedContentCard({ feed }: CrewBattleFeedContentCardProps) {
    return (
        <div className="container">
            <div className="form-control" style={{ width: '100%' }}>
                <div className="d-flex justify-content-center align-items-center">
                    <img src="/img/running.png" alt="Running" className="img-fluid"/>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <div>{feed.feed_post}</div>
                    <div>{feed.feed_kcal}kcal</div>
                </div>
            </div>
        </div>
    );
}

export default CrewBattleFeedContentCard;
