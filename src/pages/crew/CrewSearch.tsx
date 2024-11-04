import SearchBar from "pages/community/communityComponent/SearchBar";
import { useEffect, useState } from "react";
import CrewPostList from "./CrewPost/CrewPostList";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewJoinModal from "components/ui/modal/CrewJoinModal";

function CrewSearch(): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const [crewList, setCrewList] = useState<any[]>([]);
    const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);

    const handleSearch = () => {
        console.log("검색버튼 클릭");
    };

    const handleCreatePost = () => {
        console.log("게시물 작성 버튼 클릭");
    };

    const handlePostClick = (crewId: number) => {
        console.log(`Post clicked for crew ID: ${crewId}`);
        setSelectedCrewId(crewId);
    };

    useEffect(() => {
        const getCrewList = async () => {
            try{
                const response = await api.get("crew/list",{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setCrewList(response.data);
            } catch (error) {
                console.error("크루 목록 조회 실패", error);
            }
        };
        getCrewList();
    }, []);

    return (
        <div className="container">
            {/* 검색바와 게시물 작성 버튼 */}
            <div className="search-and-write">
                <SearchBar onSearch={handleSearch} />
                <button className="btn btn-primary write-button" onClick={handleCreatePost}>
                    크루 생성
                </button>
            </div>

            {/* 게시물 목록 */}
            {crewList.length > 0 ?(
                crewList.map((crew) => {
                    return (
                        <CrewPostList key={crew.crew_id} crew={crew} onCrewClick={handlePostClick}  />
                    )
                })
            ) : (
                <div>
                    <h2>모집중인 크루가 없습니다.</h2>
                </div>
            )}

            {/* join modal */}
            <div className="modal fade" id="crewJoinModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="crewJoinModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="crewJoinModalLabel">크루 참여</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedCrewId !== null && (
                                <CrewJoinModal crew_id={selectedCrewId}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    );
}

export default CrewSearch;
