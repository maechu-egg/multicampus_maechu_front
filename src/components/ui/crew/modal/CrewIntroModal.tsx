import React, { useEffect, useState } from "react";
import "./Modal.css";
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";

function CrewIntroModal({
  crew_id,
  onClick,
}: {
  crew_id: number;
  onClick: () => void;
}) {
  const { state } = useAuth();
  const token = state.token;
  const member_id = state.memberId;

  const [crew_name, setCrew_name] = useState("");
  const [crew_intro_post, setCrew_intro_post] = useState("");
  const [crew_intro_img, setCrew_intro_img] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCrew_intro_img(e.target.files[0]);
    }
  };

  // 크루 소개글 조회 API
  useEffect(() => {
    const getIntro = async () => {
      try {
        const response = await api.get(`crew/info/${crew_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCrew_name(response.data.crew_name);
        setCrew_intro_post(response.data.crew_intro_post);
      } catch (err) {
        console.error("크루 정보 불러오기 에러:", err);
      }
    };
    getIntro();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("crew_name", crew_name);
    data.append("crew_intro_post", crew_intro_post);
    if (crew_intro_img) {
      data.append("crew_intro_img", crew_intro_img);
    }
    data.append("crew_id", crew_id.toString());

    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    // 크루 소개글 관리 업데이트 API
    const updateCrewIntro = async () => {
      try {
        const response = await api.patch(`crew/intro/update`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("debug >>> updateCrewIntro response", response);
        alert("크루 소개글 수정이 완료되었습니다.");
        onClick();
      } catch (error) {
        console.error("Error updating crew intro:", error);
        alert("크루 소개글 수정에 실패 했습니다.");
      }
    };
    updateCrewIntro();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {/* 사진 */}
        <div className="form-group form-control" style={{ width: "100%" }}>
          <label>사진</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleFileChange}
            style={{ width: "100%" }}
          />
        </div>
        <br />
        {/* 크루 이름 (조건부 렌더링) */}
        <div className="form-group form-control" style={{ width: "100%" }}>
          <label>크루 이름</label>
          <input
            type="text"
            className="form-control"
            value={crew_name}
            onChange={(e) => setCrew_name(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <br />
        <div className="form-group form-control" style={{ width: "100%" }}>
          <label>크루 소개 내용</label>
          <input
            type="text"
            className="form-control"
            value={crew_intro_post}
            onChange={(e) => setCrew_intro_post(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <br />
        {/* 폼 제출 버튼 */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            소개글 수정
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-danger"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrewIntroModal;
