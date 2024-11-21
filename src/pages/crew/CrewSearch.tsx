import { useEffect, useState } from "react";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewJoinModal from "components/ui/crew/modal/CrewJoinModal";
import CrewCard from "components/ui/crew/card/CrewCard";
import CrewCreateModal from "components/ui/crew/modal/CrewCreateModal";
import CategoryDropdown from "pages/community/communityComponent/CategoryDropdown";
import categoriesData from "assets/data/categories.json";
import styled from "styled-components";

const Button = styled.button`
  background-color: #6C757D;
  color: #fff;
  border: none;
  width: fit-content;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #A0A5AB;
    color: #e0e0e0;
  }
`;

function CrewSearch(): JSX.Element {
    const { state } = useAuth();
    const token = state.token;
    const [crewList, setCrewList] = useState<any[]>([]);
    const [selectedCrewId, setSelectedCrewId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("");
    const [activePostSport, setActivePostSport] = useState("");

    const handlePostClick = (crewId: number) => {
        console.log(`Post clicked for crew ID: ${crewId}`);
        setSelectedCrewId(crewId);
    };

    const filteredData = crewList.filter(crew => 
        crew.crew_title && crew.crew_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        crew.crew_sport && crew.crew_sport.toLowerCase().includes(activePostSport.toLowerCase())
    );

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

    useEffect(() => {
        getCrewList();
    }, []);

    return (
        <div className="container">
            <div className="row">
                {/* CategoryDropdown */}
                <div className="col-12 mb-3">
                    <CategoryDropdown
                        post_up_sports={categoriesData.categories}
                        activeTab={activeTab}
                        activePost_sport={activePostSport}
                        onTabChange={setActiveTab}
                        onSubcategoryChange={setActivePostSport}
                        recommendedKeywords={[]}
                        onKeywordClick={() => {}}
                        showKeywords={false}
                    />
                </div>
            </div>
            {/* 검색바와 크루 생성 버튼 */}
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control mx-2"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        style={{ width: "50%"}}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#crewCreateModal"
                    >
                        크루 생성
                    </Button>
                </div>
            </div>
            <br />
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

            {/* 크루 가입 모달 */}
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

            {/* 크루 생성 모달 */}
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
