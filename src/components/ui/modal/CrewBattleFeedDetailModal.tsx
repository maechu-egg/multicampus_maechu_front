import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Modal.css';
import CrewBattleFeedCard from "../card/CrewBattleFeedCard";
import CrewBattleFeedContentCard from "../card/CrewBattleFeedContentCard";
import api from "services/api/axios";
import CrewBattleModal from "./CrewBattleModal";
import CrewBattleFeedModal from "./CrewBattleFeedModal";

interface CrewInfoProps {
    battleId: number;
}

function CrewBattleFeedDetailModal({battleId}:CrewInfoProps): JSX.Element {

    const [participantId, setParticipantId] = useState<number>(0);
    const [battleMember, setBattleMember] = useState<any[]>([]);
    const [battleFeed, setBattleFeed] = useState<any[]>([]);

    useEffect(() => {
        const getBattleFeed = async () => {
            try{
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3MzAwNzUyNTIsImV4cCI6MTczMDE2MTY1Mn0.lfn7OzR_jL8yO4BxJFkLg0GPXT2l6eJIBbFjjkooTQ4'; // 실제 토큰 값으로 대체하세요
                const response = await api.get(`crew/battle/feed/list?participant_id=${participantId}`, {
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
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJtZW1iZXJJZCI6MCwic3ViIjoidGVzdEBuYXZlci5jb20iLCJpYXQiOjE3MzAwNzUyNTIsImV4cCI6MTczMDE2MTY1Mn0.lfn7OzR_jL8yO4BxJFkLg0GPXT2l6eJIBbFjjkooTQ4'; // 실제 토큰 값으로 대체하세요
                const response = await api.get(`crew/battle/member/list?battle_id=${battleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("debug >>> battleMemberresponse", response.data);
                setBattleMember(response.data);
            } catch (error) {
                console.log("debug >>> battleMemberresponse error", error);
            }
        }
        getBattleMember();
    }, [battleId]);


    return (
        <div>
            <div className="d-flex">
                <div className="left-panel flex-shrink-0" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                    <div className="scrollable-content">
                        {battleMember.map((member, index) => (
                            <div key={member.crew_member_id}>
                                <CrewBattleFeedCard 
                                    member={member}
                                    onClickHandler={() => setParticipantId(member.participant_id)}
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
