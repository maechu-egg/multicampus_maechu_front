import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Modal.css';
import CrewBattleFeedCard from "../card/CrewBattleFeedCard";
import CrewBattleFeedContentCard from "../card/CrewBattleFeedContentCard";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";

interface CrewInfoProps {
    battleId: number;
    crewId:number;
}

function CrewBattleFeedDetailModal({battleId, crewId}:CrewInfoProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;

    const [participantId, setParticipantId] = useState<number>(0);
    const [battleMember, setBattleMember] = useState<any[]>([]);
    const [battleFeed, setBattleFeed] = useState<any[]>([]);

    useEffect(() => {
        const getBattleFeed = async () => {
            try{
                const response = await api.get(`crew/battle/feed/list?participant_id=${participantId}&crew_id=${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>>  battleFeed response", response.data);
                setBattleFeed(response.data);
            } catch (error) {
                console.log("debug >>> battleFeed error", error);
            }
        }
        getBattleFeed();
    }, [participantId]);

    useEffect(() => {
        const getBattleMember = async () => {
            try{
                const response = await api.get(`crew/battle/member/list?battle_id=${battleId}&crew_id=${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> battleMemberresponse 피드", response.data);
                setBattleMember(response.data);
            } catch (error) {
                console.log("debug >>> battleMemberresponse error", error);
            }
        }
        getBattleMember();
    }, [battleId]);


    return (
        <div className="container" style={{ width: '100%'}}>
            <div className="d-flex">
                <div className="left-panel flex-shrink-0" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                    <div className="scrollable-content">
                        <br/>
                        {battleMember.map((member, index) => (
                            <div key={member.crew_member_id}>
                                <CrewBattleFeedCard 
                                    member={member}
                                    battleId={battleId}
                                    onClickHandler={() => setParticipantId(member.participant_id)}
                                    crewId={crewId}
                                />
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right-panel" style={{ width: '100%', overflowY: 'auto', maxHeight: '100vh' }}>
                    {battleFeed.map((feed, index) => (
                        <div key={feed.feed_id}>
                            <CrewBattleFeedContentCard feed={feed} />
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CrewBattleFeedDetailModal;
