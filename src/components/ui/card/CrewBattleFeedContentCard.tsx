import React from "react";

function CrewBattleFeedContentCard() {
    return (
        <div className="container">
            <div className="form-control">
                <div className="d-flex justify-content-center align-items-center">
                    <img src="/img/running.png" alt="Running" className="img-fluid"/>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <div>오늘 러닝메이트들이랑 ^^</div>
                    <div>355kcal</div>
                </div>
            </div>
        </div>
    );
}

export default CrewBattleFeedContentCard;
