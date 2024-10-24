import React from "react";
import './Card.css';

function CrewMemberCard(): JSX.Element {

    const acceptHandler = () => {
        console.log("승인 버튼 클릭");
    }

    const rejectHandler = () => {
        console.log("거절 버튼 클릭");
    }
    /*
        useEffect로 크루번호에 맞는 멤버들의 정보를 가져온다.
    */
    return (
        <div className="card border-dark" style={{ width: '18rem', borderRadius: '15px', borderWidth: '1px' }}>
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className="mb-3"style={{ width: '50%' }}>
                    <img 
                        src="/img/bronze.jpg" 
                        alt="Badge" 
                        className="img-fluid"
                    />
                </div>
                <ul className="list-unstyled text-center" style={{ width: '50%' }}>
                    {/* 가지고온 정보를 보여줌. */}
                    <li><strong>신유민</strong></li>
                    <li><strong>나이:</strong> 11</li>
                    <li><strong>지역:</strong> 익산</li>
                    <li><strong>운동 기록:</strong> 5회</li>
                    <li><strong>배틀 승리:</strong> 1회</li>
                </ul>
            </div>
            <div className="d-flex">
                <button 
                    className="btn btn-primary flex-fill accept-btn" 
                    onClick={acceptHandler}
                >
                    승인
                </button>
                <button
                    className="btn btn-danger flex-fill reject-btn" 
                    onClick={rejectHandler}
                >
                    거절
                </button>
            </div>
        </div>
    );
}

export default CrewMemberCard;
