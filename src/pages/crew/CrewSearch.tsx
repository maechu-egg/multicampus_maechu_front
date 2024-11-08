import { useEffect, useState } from "react";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewJoinModal from "components/ui/crew/modal/CrewJoinModal";
import CrewCard from "components/ui/crew/card/CrewCard";
import CrewCreateModal from "components/ui/crew/modal/CrewCreateModal";
import CrewSearchDivEdit from "components/ui/crew/selectDiv/CrewSearchDivEdit";
import "./CrewPage.css";

function CrewSearch(): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const [crewList, setCrewList] = useState<any[]>([]);
    const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchSport, setSearchSport] = useState("");
    
    // 종목검색 div 열지 판단
    const [open, setOpen] = useState(false);

    const handlePostClick = (crewId: number) => {
        console.log(`Post clicked for crew ID: ${crewId}`);
        setSelectedCrewId(crewId);
    };

    const filteredData = crewList.filter(crew => 
        crew.crew_title && crew.crew_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        crew.crew_sport && crew.crew_sport.toLowerCase().includes(searchSport.toLowerCase())
    );

    useEffect(() => {
        const getCrewList = async () => {
            try {
                const response = await api.get("crew/list", {
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


    const setsearchSports = (searchSport: string) => {
        setSearchSport(searchSport);
    }

    const searchSportHandler = () => {
        if(open === true) {
            setOpen(false);
            setSearchSport("");
        } else {
            setOpen(true);
        }
    }

    return (
        <div className="container">
            {/* 토글 & 검색바와 게시물 작성 버튼 */}
            <div className="d-flex justify-content-between align-center">
                <div className="container1">
                    <div 
                        className="btn btn-outline-dark"
                        onClick={searchSportHandler}
                    >
                        <span className="btn-text">종목 선택</span>
                    </div>
                </div>
                <input
                    type="text"
                    className="form-control"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#crewCreateModal"
                >
                    크루 생성
                </button>
            </div>
            <br />
            {/* 종목검색 선택 div */}
            {open && 
                <CrewSearchDivEdit onSearchSport={setsearchSports}/>
            }
            <br />
            {/* 게시물 목록 */}
            <div className="row">
                {filteredData.length > 0 ? (
                    filteredData.map((crew) => {
                        return (
                            <div className="col-3 mb-3 d-flex justify-content-center" key={crew.crew_id}>
                                <CrewCard 
                                    crew={crew} 
                                    onCrewClick={() => handlePostClick(crew.crew_id)}
                                />
                            </div>
                        )
                    })
                ) : (
                    <div>
                        <h2>모집중인 크루가 없습니다.</h2>
                    </div>
                )}
            </div>

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

            {/* create modal */}
            <div className="modal fade" id="crewCreateModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="crewCreateModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="crewCreateModalLabel">크루 생성</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewCreateModal/>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    );
}

export default CrewSearch;
