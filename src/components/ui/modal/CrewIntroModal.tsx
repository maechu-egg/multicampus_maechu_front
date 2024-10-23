import React, { useState } from "react";
import './Modal.css';

function CrewIntroModal() {
    const [crewName, setCrewName] = useState('');
    const [crewIntro, setCrewIntro] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            crewName,
            crewIntro,
            fileName: selectedFile ? selectedFile.name : null, // 파일 이름을 보낼 경우
        };
        console.log('Form Data:', formData);

    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
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
