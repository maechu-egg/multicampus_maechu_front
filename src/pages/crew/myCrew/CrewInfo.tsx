import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CrewModal from "components/ui/crew/modal/CrewModal";
import CrewIntroModal from "components/ui/crew/modal/CrewIntroModal";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
const BASE_URL = "http://localhost:8001"; // 서버의 기본 URL


interface CrewInfoProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewInfo({ crewId }: CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const memberId = state.memberId;
    {/* 
        useEffect로 crewId에 맞는 정보 불러와서 crew_intro_img 왼쪽에 보여주고
        crew_name 오른쪽 윗부분, crew_intro_post 오른쪽 아래부분
    */}
    const [crewName, setCrewName] = useState<string>("");

    const [crewIntroImg, setCrewIntroImg] = useState<string>("");
    const [imgPath, setImgPath] = useState<string>("");
    const [crewIntroPost, setCrewIntroPost] = useState<string>("");
    const [crewDate, setCrewDate] = useState<string>("");
    const [crewLeader, setCrewLeader] = useState(0);

    //특정 크루 정보 조회 API
    const selectCrew = async() => {
        try{
            const response = await api.get(`crew/info/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("debug >>> 크루소개페이지 response", response.data);
            setCrewName(response.data.crew_name);
            setCrewIntroImg(response.data.crew_intro_img);
            setCrewIntroPost(response.data.crew_intro_post);
            setCrewDate(response.data.crew_date);
            setCrewLeader(response.data.member_id);
        } catch (error) {
            console.log('Error selecting crew:', error);
        }
    }

    useEffect(() => {
        selectCrew();
    },[]);

    // 크루 이미지설정이 안되어있을 시 기본 이미지 세팅
    useEffect(() => {
        if (crewIntroImg.includes("CrewDefault")) {
            setImgPath('img/default/CrewDefault.png');
        } else if(crewIntroImg != "CrewDefault") {
            setImgPath(`${BASE_URL}${crewIntroImg}`);
        }
        console.log("이미지 경로", imgPath);
    },[crewIntroImg]);
    
    // 2024-11-04 00:00:00 을 2024년 11월 4일 로 변환
    const formattedCrewDate = new Date(crewDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // 크루 삭제 API
    const handleDeleteCrew = async() => {
        // 바로 삭제가 아닌 한번더 확인을 위환 과정
        const confirmDelete = window.confirm("정말로 크루를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try{
            const response = await api.delete(`crew/delete/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("debug >>> handleDeleteCrew response", response.data);
            alert("크루 삭제가 완료되었습니다.");
            window.location.reload(); // 현재 페이지 리로딩
        } catch (error) {
            console.log('Error deleting crew:', error);
        }
    }

    return (
        <div className="container">
            <br />
            <br />
            <br />
            {memberId == crewLeader && (
                <div className="row">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteCrew}
                            style={{background:"rgba(120, 0, 22)", border:"none"}}
                        >
                            크루삭제
                        </button>
                    </div>
                    <div className="col-6 d-flex justify-content-end align-items-center">
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
            )}
            <br />
            <div className="d-flex justify-content-center align-items-center" style={{border:"1px solid #E2E6E9", padding: "20px"}}>
                <div style={{width: '100%'}}>
                    <img
                        src={imgPath}
                        alt="크루 이미지"
                        className="img-fluid"
                        style={{marginRight: "0px", width: '100%'}}
                    />
                </div>
                <div style={{width: '100%', margin: "20px"}}>
                    <div className="d-flex justify-content-center">
                        <h1>{crewName}</h1>
                    </div>
                    <p className="d-flex justify-content-center">
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
            <br />

            {/* 게시물 관리 모달창 */}
            <div className="modal fade" id="postModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="postModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered"> 
                    <div className="modal-content" style={{width: "100%", maxWidth: "none"}}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="postModalLabel">게시물 수정</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewModal crew_id={crewId} onClick={selectCrew}/>
                        </div>
                    </div>
                </div>
            </div>


            {/* 소개글 관리 모달창 */}
            <div className="modal fade " id="introModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="introModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{width: "100%", maxWidth: "none"  }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="introModalLabel">소개글 수정</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewIntroModal crew_id={crewId} onClick={selectCrew}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewInfo;
