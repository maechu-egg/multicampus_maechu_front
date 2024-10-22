import CrewBattleModal from "components/ui/modal/CrewBattleModal";
import React from "react";
import "../CrewPage.css";
import CrewBattleCard from "components/ui/card/CrewBattleCard";

interface CrewBattleProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewBattle({ crewId }: CrewBattleProps): JSX.Element {

    return (
        <div className="container">
            <br/>
            {/* useEffect를 사용하여 DB에서 배틀 데이터를 가져와서 CrewBattleCard 컴포넌트에 props로 전달 */}
            <div className="row">
                <div className="col-6">
                    <button
                        className="btn btn-primary mb-3"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                    >
                        배틀 생성
                    </button>
                </div>
                {/* carousel 버튼 */}
                <div className="col-6 d-flex justify-content-end">
                    <button className="btn btn-primary mb-3 mr-1" data-bs-target="#carousel" data-bs-slide="prev">
                        <i className="fa fa-arrow-left"></i>
                    </button>
                    <button className="btn btn-primary mb-3 mx-4" data-bs-target="#carousel" data-bs-slide="next">
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </div>

                {/* carousel */}
                <div className="col-12">
                    <div id="carousel" className="carousel slide" data-bs-ride="false">
                        <div className="carousel-inner">
                            {/* 첫 번째 슬라이드 */}
                            <div className="carousel-item active">
                                <div className="row">
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                </div>
                            </div>
                            {/* 두 번째 슬라이드 */}
                            <div className="carousel-item">
                                <div className="row">
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                    <div className="col-12 col-md-4 mb-3 d-flex justify-content-center">
                                        <CrewBattleCard />
                                    </div>
                                </div>
                            </div>
                            {/* 추가적인 carousel-item을 필요에 따라 추가 */}
                        </div>
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
