import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CrewModal from "components/ui/modal/CrewModal";
import CrewIntroModal from "components/ui/modal/CrewIntroModal";
import axios from "axios";
import api from "services/api/axios";

interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewInfo({ crewId }: CrewInfoProps): JSX.Element {
    {/* 
        useEffect로 crewId에 맞는 정보 불러와서 crew_intro_img 왼쪽에 보여주고
        crew_name 오른쪽 윗부분, crew_intro_post 오른쪽 아래부분
    */}
    const [crewName, setCrewName] = useState<string>("");
    const [crewIntroImg, setCrewIntroImg] = useState<string>("");
    const [crewIntroPost, setCrewIntroPost] = useState<string>("");
    const [crewDate, setCrewDate] = useState<string>("");

    useEffect(() => {
        const selectCrew = async() => {
            try{
                /* crewId는 크루 헤더에서 내 크루 클릭시 크루아이디가 props로 넘어옴. */
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3MzAwNzUyNTIsImV4cCI6MTczMDE2MTY1Mn0.lfn7OzR_jL8yO4BxJFkLg0GPXT2l6eJIBbFjjkooTQ4'; // 실제 토큰 값으로 대체하세요
                const response = await api.get(`crew/info/${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> selectCrew response", response.data);
                setCrewName(response.data.crew_name);
                setCrewIntroImg(response.data.crew_intro_img);
                setCrewIntroPost(response.data.crew_intro_post);
                setCrewDate(response.data.crew_date);
            } catch (error) {
                console.log('Error selecting crew:', error);
            }
        }
        selectCrew();
    },[crewId]);
    

    const formattedCrewDate = new Date(crewDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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
                        <h1>{crewName}</h1>
                    </div>
                    <p>
                        {crewIntroPost}
                    </p>
                    <div className="d-flex justify-content-center">
                        <p>since</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <p>{formattedCrewDate}</p>
                    </div>
                </div>
            </div>

            {/* 게시물 modal */}
            <div className="modal fade" id="postModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="postModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered"> 
                    <div className="modal-content" style={{width: "100%", maxWidth: "none"}}>
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
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{width: "100%", maxWidth: "none"  }}>
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
