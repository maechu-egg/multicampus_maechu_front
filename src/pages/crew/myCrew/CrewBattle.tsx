import CrewBattleModal from "components/ui/modal/CrewBattleModal";
import React from "react";
import "../CrewPage.css"

interface CrewBattleProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewBattle({ crewId }: CrewBattleProps): JSX.Element {

    const CreateBattleHandler = () => {
        // 배틀 생성 로직
    }

    return (
        <div className="container">
            <br />
            <div className="d-flex justify-content-between">
                <div
                    className="card text-center mb-3 btn"
                    style={{ width: "18rem", background: "#D9D9D9", height: "25rem", flexShrink: 0, marginRight: "20px" }} // marginRight 추가
                    onClick={CreateBattleHandler}
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                >
                    <div className="card-body">
                        <h3 className="card-title">배틀 생성</h3>
                        <br />
                        <br />
                        <br />
                        <img src="/img/create.png" className="card-img mx-0" style={{ width: "150px", opacity: 0.3 }} />
                    </div>
                </div>
                {/* 캐러셀을 배틀 생성 카드 오른쪽으로 이동 */}
                <div className="flex-grow-1">
                    {/* Carousel for Battle Cards */}
                    <div id="battleCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="d-flex">
                                    {/* 첫 번째 카드 */}
                                    <div className="card text-center mb-3" style={{ width: "18rem", height: "26rem", marginRight: "20px" }}>
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
                                                    <div className="progress-bar"></div>
                                                </div>
                                                <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                                                    <div className="progress-bar bg-danger"></div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                                                <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                                            </div>
                                            <div className="justify-content-center align-items-center">
                                                <p>종료일 : 2024.10.20</p>
                                            </div>
                                            <p className="card-text" style={{ fontSize: "15px" }}>배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용</p>
                                            <div className="mt-auto">
                                                <a href="#" className="btn btn-secondary">상세 보기</a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 두 번째 카드 */}
                                    <div className="card text-center mb-3" style={{ width: "18rem", height: "26rem", marginRight: "20px" }}>
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-start align-items-center">
                                                <h3 className="card-title">배틀 제목 2</h3>
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
                                                    <div className="progress-bar"></div>
                                                </div>
                                                <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                                                    <div className="progress-bar bg-danger"></div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                                                <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                                            </div>
                                            <div className="justify-content-center align-items-center">
                                                <p>종료일 : 2024.10.20</p>
                                            </div>
                                            <p className="card-text" style={{ fontSize: "15px" }}>배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용</p>
                                            <div className="mt-auto">
                                                <a href="#" className="btn btn-secondary">상세 보기</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="d-flex">
                                    {/* 첫 번째 카드 */}
                                    <div className="card text-center mb-3" style={{ width: "18rem", height: "26rem", marginRight: "20px" }}>
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-start align-items-center">
                                                <h3 className="card-title">배틀 제목 4</h3>
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
                                                    <div className="progress-bar"></div>
                                                </div>
                                                <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                                                    <div className="progress-bar bg-danger"></div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                                                <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                                            </div>
                                            <div className="justify-content-center align-items-center">
                                                <p>종료일 : 2024.10.20</p>
                                            </div>
                                            <p className="card-text" style={{ fontSize: "15px" }}>배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용</p>
                                            <div className="mt-auto">
                                                <a href="#" className="btn btn-secondary">상세 보기</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card text-center mb-3" style={{ width: "18rem", height: "26rem", marginRight: "20px" }}>
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-start align-items-center">
                                                <h3 className="card-title">배틀 제목 5</h3>
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
                                                    <div className="progress-bar"></div>
                                                </div>
                                                <div className="progress" role="progressbar" aria-label="Segment two" aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} style={{ width: '40%' }}>
                                                    <div className="progress-bar bg-danger"></div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="me-3" style={{ fontSize: "15px" }}>60%</p>
                                                <p className="ms-3" style={{ fontSize: "15px" }}>40%</p>
                                            </div>
                                            <div className="justify-content-center align-items-center">
                                                <p>종료일 : 2024.10.20</p>
                                            </div>
                                            <p className="card-text" style={{ fontSize: "15px" }}>배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용 배틀 내용</p>
                                            <div className="mt-auto">
                                                <a href="#" className="btn btn-secondary">상세 보기</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#battleCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#battleCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">배틀 생성</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewBattleModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewBattle;
