import React, { useState } from "react";

function CrewIntroModal() {
    const [crewName, setCrewName] = useState('');
    const [crewIntro, setCrewIntro] = useState('');
    const [postOption, setPostOption] = useState('poster');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(postOption === 'basic'){
            const formData = {
                crewName,
                crewIntro,
                postOption,
                fileName: selectedFile ? selectedFile.name : null, // 파일 이름을 보낼 경우
            };
            console.log('Form Data:', formData);
        } else {
            const formData = {
                postOption,
                fileName: selectedFile ? selectedFile.name : null, // 파일 이름을 보낼 경우
            };
            console.log('Form Data:', formData);
        }
        
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 게시글 여부 */}
                <div className="form-control">
                    <label>소개글 타입</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="tabs form-check form-check-inline w-100">
                            <input
                                type="radio"
                                id="poster"
                                name="postOption"
                                value="poster"
                                checked={postOption === 'poster'}
                                onChange={(e) => setPostOption(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="poster">포스터 형식</label>

                            <input
                                type="radio"
                                id="basic"
                                name="postOption"
                                value="basic"
                                checked={postOption === 'basic'}
                                onChange={(e) => setPostOption(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="basic">기본 형식</label>
                            <span className='glider2'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 사진 */}
                <div className="form-group form-control">
                    <label>사진</label>
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                    />
                </div>
                <br />
                {/* 크루 이름 (조건부 렌더링) */}
                {postOption === 'basic' && (
                    <>
                        <div className="form-group form-control">
                            <label>크루 이름</label>
                            <input
                                type="text"
                                className="form-control"
                                value={crewName}
                                onChange={(e) => setCrewName(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="form-group form-control">
                            <label>크루 소개 내용</label>
                            <input
                                type="text"
                                className="form-control"
                                value={crewIntro}
                                onChange={(e) => setCrewIntro(e.target.value)}
                            />
                        </div>
                        <br />
                    </>
                )}

                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">소개글 작성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewIntroModal;
