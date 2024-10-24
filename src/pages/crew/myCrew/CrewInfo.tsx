import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CrewModal from "components/ui/modal/CrewModal";
import CrewIntroModal from "components/ui/modal/CrewIntroModal";

interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewInfo({ crewId }: CrewInfoProps): JSX.Element {
    {/* 
        useEffect로 crewId에 맞는 정보 불러와서 crew_intro_img 왼쪽에 보여주고
        crew_name 오른쪽 윗부분, crew_intro_post 오른쪽 아래부분
    */}
    return (
        <div className="container">
            <br />
            <br />
            <br />
            <div className="row">
                <div className="col-12 d-flex justify-content-end align-items-center">
                    <button 
                        className="btn btn-secondary mx-4"
                        data-bs-toggle="modal"
                        data-bs-target="#postModal"
                    >
                        게시글 관리
                    </button>
                    <button 
                        className="btn btn-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#introModal"
                    >
                        소개글 관리
                    </button>
                </div>
            </div>
            <div className="row mt-3 d-flex justify-content-around align-items-center">
                <div className="col-md-8 col-12 d-flex justify-content-center">
                    <img
                        src="/img/person.png"
                        alt="크루 이미지"
                        className="img-fluid"
                        style={{marginRight: "0px"}}
                    />
                </div>
                <div className="col-md-8 col-12">
                    <div className="d-flex justify-content-center">
                        <h1>크루 이름</h1>
                    </div>
                    <p>
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                        크루 소개 크루 소개 크루 소개 크루 소개 크루 소개 
                    </p>
                    <div className="d-flex justify-content-center">
                        <p>since</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <p>20xx.xx.xx</p>
                    </div>
                </div>
            </div>

            {/* 게시물 modal */}
            <div className="modal fade" id="postModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="postModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg"> 
                    <div className="modal-content" style={{width: "100%"}}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="postModalLabel">게시물 수정</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewModal />
                        </div>
                    </div>
                </div>
            </div>


            {/* 소개글 modal */}
            <div className="modal fade " id="introModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="introModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{width: "100%"}}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="introModalLabel">소개글 수정</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewIntroModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewInfo;
