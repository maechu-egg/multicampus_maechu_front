import React from "react";

function CrewBattleFeedCard() {
    return (
        <div className="container">
            <br />
            <div className="d-flex justify-content-center align-items-center">
                <div className="card border-dark" style={{ width: '90%', borderRadius: '15px', borderWidth: '1px' }}>
                    <div className="card-body d-flex justify-content-between align-items-center" style={{height: "110px", padding: "4px"}}>
                        <div style={{ width: '50%', height: '100%' }}>
                            <img 
                                src="/img/bronze.jpg" 
                                alt="Badge" 
                                className="img-fluid"
                            />
                        </div>
                        <ul className="list-unstyled text-center" style={{ width: '50%' }}>
                            {/* 가지고온 정보를 보여줌. */}
                            <li><strong>신유민</strong></li>
                        </ul>
                    </div>
                    <div>
                        <ul className="list-unstyled text-end" style={{ width: '100%' }}>
                            <li><strong>피드</strong> : 2개</li>
                            <li><strong>누적 칼로리</strong>:000kcal</li>
                            <li><strong>누적 운동시간</strong>:5H 30M</li>
                        </ul>
                    </div>
                    <div className="d-flex">
                        <button 
                            className="btn btn-primary flex-fill accept-btn" 
                        >
                            피드 추가
                        </button>
                        <button
                            className="btn btn-danger flex-fill reject-btn" 
                        >
                            투표 하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrewBattleFeedCard;
