import React from "react";

function CrewBattleCard() {
    return (
        <div className="card text-center mb-3" style={{ width: "20em", height: "100%", marginRight: "20px" }}>
            {/* props 받아서 온 데이터들 정리해서 보여주기 */}
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-start align-items-center">
                    <h3 className="card-title">배틀 제목 1</h3>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="badge rounded-pill text-bg-primary">진행중</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                    <img src="/img/VS.png" className="card-img mx-1" style={{ width: "30%" }} />
                    <img src="/img/person.png" className="card-img mx-1" style={{ width: "35%" }} />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "18px" }}>신유민</p>
                    <p className="ms-3" style={{ fontSize: "18px" }}>강은종</p>
                </div>
                <div className="progress-stacked">
                    <div className="progress" role="progressbar" aria-label="Segment one" aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} style={{ width: '60%' }}>
                        <div className="progress-bar bg-primary" style={{height: "100%"}}></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                        <div className="progress-bar bg-danger" style={{height: "100%"}}></div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                    <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                </div>
                <div className="justify-content-center align-items-center">
                    <p>종료일 : 2024.10.20</p>
                </div>
                <p className="card-text" style={{ fontSize: "15px" }}>배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용</p>
                <div className="mt-auto">
                    <a href="#" className="btn btn-secondary">상세 보기</a>
                </div>
            </div>
        </div>
    );
}

export default CrewBattleCard;
