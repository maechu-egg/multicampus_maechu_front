import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import '../../../../pages/badge/badgeModalComponents/BadgeScoreGuide.css'

const sportsData = {
    health: [
        "헬스(웨이트 트레이닝)", "필라테스", "요가", "크로스핏", "사이클(스피닝)", "홈 트레이닝", "러닝/조깅", "HIIT"
    ],
    together: [
        "축구", "농구", "배구", "풋살", "핸드볼", "럭비", "야구"
    ],
    personal: [
        "테니스", "배드민턴", "탁구", "골프", "스쿼시", "클라이밍", "격투기"
    ],
    outdoor: [
        "수영", "서핑", "스킨스쿠버", "스케이트보드/롱보드", "하이킹/트레킹", "스키/스노보드", "카약/래프팅", "패러글라이딩"
    ],
    dance: [
        "줌바", "힙합댄스", "라틴댄스", "발레", "스트릿 댄스"
    ]
};

function CrewSearchDivEdit ({onSearchSport}: { onSearchSport: (sport: string) => void }) {

    const [detailSport, setDetailSport] = useState('');
    const [searchSport, setSearchSport] = useState('');

    useEffect(() => {
        onSearchSport(searchSport);
    }, [searchSport]);

    return (
        <div className="d-flex justify-content-start aligh-items-center form-control" style={{width: '100%'}}>
            <div className="badge-guide-list" style={{maxHeight: '330px',width : '30%' ,marginTop :'0px', borderRight : '1px solid'}}>
                <div className="badge-guide-item">
                    <div className="badge-info" onClick={() => setDetailSport("health")}>
                        <h4>헬스 및 피트니스</h4>
                    </div>
                </div>
                <div className="badge-guide-item" onClick={() => setDetailSport("together")}>
                    <div className="badge-info">
                        <h4>단체 스포츠</h4>
                    </div>
                </div>
                <div className="badge-guide-item" onClick={() => setDetailSport("personal")}>
                    <div className="badge-info">
                        <h4>개인 스포츠</h4>
                    </div>
                </div>
                <div className="badge-guide-item" onClick={() => setDetailSport("outdoor")}>
                    <div className="badge-info">
                        <h4>레저 및 아웃도어 스포츠</h4>
                    </div>
                </div>
                <div className="badge-guide-item" onClick={() => setDetailSport("dance")}>
                    <div className="badge-info">
                        <h4>댄스 및 퍼포먼스 스포츠</h4>
                    </div>
                </div>
            </div>
            {/* 헬스 및 피트니스 */}
            {detailSport === "health" &&
                <div className="badge-guide-list" style={{width : '70%' ,marginTop :'0px', paddingLeft : '10px', maxHeight: '330px'}}>
                    {sportsData["health"].map((sport) => (
                        <div className="badge-guide-item" key={sport} onClick={() => {setSearchSport(sport)}}>
                            <div className="badge-info">
                                <h4>{sport}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {/* 단체 스포츠 */}
            {detailSport === "together" &&
                <div className="badge-guide-list" style={{width : '70%' ,marginTop :'0px', paddingLeft : '10px', maxHeight: '330px'}}>
                    {sportsData["together"].map((sport) => (
                        <div className="badge-guide-item" key={sport} onClick={() => {setSearchSport(sport)}}>
                            <div className="badge-info">
                                <h4>{sport}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {detailSport === "personal" &&
                <div className="badge-guide-list" style={{width : '70%' ,marginTop :'0px', paddingLeft : '10px', maxHeight: '330px'}}>
                    {sportsData["personal"].map((sport) => (
                        <div className="badge-guide-item" key={sport} onClick={() => {setSearchSport(sport)}}>
                            <div className="badge-info">
                                <h4>{sport}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {detailSport === "outdoor" &&
                <div className="badge-guide-list" style={{width : '70%' ,marginTop :'0px', paddingLeft : '10px', maxHeight: '330px'}}>
                    {sportsData["outdoor"].map((sport) => (
                        <div className="badge-guide-item" key={sport} onClick={() => {setSearchSport(sport)}}>
                            <div className="badge-info">
                                <h4>{sport}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {detailSport === "dance" &&
                <div className="badge-guide-list" style={{width : '70%' ,marginTop :'0px', paddingLeft : '10px', maxHeight: '330px'}}>
                    {sportsData["dance"].map((sport) => (
                        <div className="badge-guide-item" key={sport} onClick={() => {setSearchSport(sport)}}>
                            <div className="badge-info">
                                <h4>{sport}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default CrewSearchDivEdit;