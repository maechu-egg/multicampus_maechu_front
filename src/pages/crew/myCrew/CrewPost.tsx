import { useEffect, useState } from "react";
import CrewPostList from "components/ui/crew/crewPost/CrewPostList";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import CrewCreatePostModal from "components/ui/crew/modal/CrewCreatePostModal";
import CrewPostDetail from "components/ui/crew/crewPost/CrewPostDetail";
import CrewPagination from "components/ui/crew/crewPost/CrewPagination";
import styled from "styled-components";

interface CrewPostProps {
    crewId: number; // 크루 ID를 prop으로 받습니다.
}

interface Post {
    crew_post_id: number;
    crew_post_title: string;
    crew_post_contents: string;
    crwe_post_img: string;
    crew_post_like: number;
    crew_post_state: number;
    crew_post_date : string;
    crew_id: number;
    nickname: string;
    member_id: number;
    comment_count: number;
}

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

function CrewPost({ crewId }:CrewPostProps): JSX.Element {
    const { state } = useAuth();
    const token = state.token;

    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<number | null>(null);

    const [popular, setPopular] = useState<Post[]>([]);
    const [notification, setNotification] = useState<Post[]>([]);

    const postsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const indexOfLastPost = currentPage * postsPerPage; // 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 첫 번째 게시물 인덱스
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 맞는 게시물 목록

    // 크루포스트 조회 API
    const getCrewPost = async() => {
        const params = {
            currentPage: currentPage ,
            size:10,
        }
        try {
            const response = await api.get(`crew/post/list/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params, 
            })
            console.log("크루포스트 가져오기 response : ", response.data);
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
        } catch (err) {
            console.log("크루포스트 가져오기 에러 : ", err);
        }
    }

    // 인기 게시물 조회 API
    const getPopulacPost = async() => {
        const params = {
            crew_id: crewId,
            crew_post_state: 1,
        }
        try{
            const response = await api.get("crew/post/top", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params, 
            });
            console.log("인기게시물 조회 response ", response.data);
            setPopular(response.data);
        } catch (err) {
            console.log("인기게시물 조회 err", err);
        }
    }

    // 공지 게시물 조회 API
    const getnotificationPost = async() => {
        const params = {
            crew_id: crewId,
            crew_post_state: 0,
        }
        try{
            const response = await api.get("crew/post/top", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params, 
            });
            console.log("공지게시물 조회 response ", response.data);
            setNotification(response.data);
        } catch (err) {
            console.log("공지게시물 조회 err", err);
        }
    }
    useEffect(() => {
        getPopulacPost();
        getnotificationPost();
        getCrewPost();
    },[currentPage])

    const handlePostClick = async (post: Post) => {
        setSelectedPost(post.crew_post_id);
        console.log("절대 확인해야됨 " , selectedPost);
    };
    useEffect(() => {
        console.log("posts 상태 변경됨: ", posts);
    }, [posts]);

    const onBack = () => {
        setSelectedPost(null);
        getCrewPost();
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }
    // 상태 변경 감지
    useEffect(() => {
        console.log("현재 페이지 변경됨 ", currentPage);
    }, [currentPage]);



    return (
        <div className="container">
            {selectedPost === null ? (
                <>
                    <br />
                    {/* 토글 & 검색바와 게시물 작성 버튼 */}
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
                                data-bs-target="#crewCreatePostModal"
                            >
                                게시물 생성
                            </Button>
                        </div>
                    </div>
                    <br />
                    <div className="container">
                        <h2>최신 공지 및 인기 게시물</h2>
                        <br />
                        <CrewPostList posts={notification} onPostClick={handlePostClick} />
                        <CrewPostList posts={popular} onPostClick={handlePostClick} />
                    </div>
                    <div className="container">
                        <br />
                        <h2>전체 게시물</h2>
                        <br />
                        <CrewPostList posts={posts.filter(post => post.crew_post_title.includes(searchTerm))} onPostClick={handlePostClick}/>
                        <CrewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                    </div>
                </>
            ) : (
                <>
                    <br/>
                    <CrewPostDetail  crewPostId={selectedPost} crewId={crewId} onBack={onBack}/>
                </>
            )}
            <br />

            {/* 크루 생성 모달창 */}
            <div className="modal fade" id="crewCreatePostModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="crewCreatePostModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content" style={{ width: "100%", maxWidth: "none" }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="crewCreatePostModalLabel">게시물 생성</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <CrewCreatePostModal crewId={crewId} onClick={getCrewPost}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrewPost;