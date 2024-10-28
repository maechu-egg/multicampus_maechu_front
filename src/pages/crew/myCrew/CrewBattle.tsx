import React, { useEffect, useState } from "react";
import CrewBattleModal from "components/ui/modal/CrewBattleModal";
import CrewBattleCard from "components/ui/card/CrewBattleCard";
import CrewBattleFeedDetailModal from "components/ui/modal/CrewBattleFeedDetailModal";
import api from "services/api/axios";
import CrewBattleFeedModal from "components/ui/modal/CrewBattleFeedModal";

interface CrewBattleProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

function CrewBattle({ crewId }: CrewBattleProps): JSX.Element {

    const [battleList, setBattleList] = useState<any[]>([]);
    const [selectedBattleId, setSelectedBattleId] = useState(0);

    useEffect(() => {
        const getBattleList = async() => {
            try{
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3MzAwNzUyNTIsImV4cCI6MTczMDE2MTY1Mn0.lfn7OzR_jL8yO4BxJFkLg0GPXT2l6eJIBbFjjkooTQ4';
                const response = await api.get(`crew/battle/list?crew_id=${crewId}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> getBattleList response", response.data);
                setBattleList(response.data);
            } catch(e){
                console.log("debug >>> getBattleList error", e);
            }
        };
        getBattleList();
    }, [crewId]);

    return (
        <div className="container">
            <br/>
            <div className="row">
                <div className="col-6">
                    <button
                        className="btn btn-primary mb-3"
                        data-bs-toggle="modal"
                        data-bs-target="#battleModal"
                    >
                        배틀 생성
                    </button>
                </div>
                <div className="col-6 d-flex justify-content-end">
                    <button className="btn btn-primary mb-3 mr-1" data-bs-target="#carousel" data-bs-slide="prev">
                        <i className="fa fa-arrow-left"></i>
                    </button>
                    <button className="btn btn-primary mb-3 mx-4" data-bs-target="#carousel" data-bs-slide="next">
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </div>

                <div className="col-12">
                    <div id="carousel" className="carousel slide" data-bs-ride="false">
                        <div className="carousel-inner">
                            {battleList.map((battle, index) => (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={battle.battle_id}>
                                    <div className="row">
                                        {battleList.slice(index * 3, index * 3 + 3).map((battle) => (
                                            <div className="col-12 col-md-4 mb-3 d-flex justify-content-center" key={battle.battle_id}>
                                                <CrewBattleCard 
                                                    battle={battle} 
                                                    onDetailClick={() => setSelectedBattleId(battle.battle_id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CrewBattleFeedDetailModal 모달 */}
            <div className="modal fade" id="battleFeedDetailModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="battleFeedDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen" >
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewBattleFeedDetailModal battleId={selectedBattleId} /> {/* battleId 전달 */}
                        </div>
                    </div>
                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="battleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="battleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="battleModalLabel">배틀 생성</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewBattleModal />
                        </div>
                    </div>
                </div>
            </div>

            {/* feed modal */}
            <div className="modal fade" id="battleFeedModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="battleFeedModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="battleFeedModalLabel">피드 추가</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewBattleFeedModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewBattle;
