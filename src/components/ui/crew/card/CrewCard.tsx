import React from "react";
import { CiLocationOn } from "react-icons/ci";

function CrewCard({crew, onCrewClick}: { crew: any; onCrewClick: () => void }) {
    return (
        <div className="card card-crew" style={{"width": "100%"}} 
            onClick={onCrewClick}
            data-bs-toggle="modal"
            data-bs-target="#crewJoinModal"
        >
            <img src="img/person.png" className="card-img-top" alt=""/>
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
