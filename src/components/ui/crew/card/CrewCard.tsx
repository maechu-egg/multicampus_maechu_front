import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
const BASE_URL = "http://localhost:8001"; // 서버의 기본 URL

function CrewCard({crew, onCrewClick}: { crew: any; onCrewClick: () => void }) {

    const [imgPath, setImgPath] = useState('');
    
    useEffect(() => {
        if(crew.crew_intro_img === "CrewDefault") {
            setImgPath('img/default/CrewDefault.png');
        } else if(crew.crew_intro_img != "CrewDefault") {
            setImgPath(`${BASE_URL}${crew.crew_intro_img}`);
        }
        console.log("이미지 경로", imgPath);
    })
    return (
        <div className="card card-crew" style={{"width": "100%"}} 
            onClick={onCrewClick}
            data-bs-toggle="modal"
            data-bs-target="#crewJoinModal"
        >
            <img src={imgPath} className="card-img-top" alt=""/>
            <div className="card-body">
                <p className="card-text">
                    {crew.crew_sport}
                    <br />
                    <strong>{crew.crew_title}</strong>
                </p>
                <p className="card-text">
                    <CiLocationOn /> {crew.crew_location}
                </p>
            </div>
        </div>
    )
}

export default CrewCard;
