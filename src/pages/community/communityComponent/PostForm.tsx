import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostForm.css";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    content: string;
  };
  onSave: (title: string, content: string) => void;
  onCancel: () => void; 
}

const PostForm: React.FC<PostFormProps> = ({ mode, initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, content);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h2>{mode === "create" ? "게시물 작성" : "게시물 수정"}</h2>
      <div className="mb-3">
        <label className="form-label">카테고리:</label>
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="헬스">헬스</option>
          <option value="런닝">런닝</option>
          <option value="필라테스">필라테스</option>
          <option value="크로스핏">크로스핏</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">카테고리 소분류:</label>
        <select className="form-select" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="자유">자유</option>
          <option value="질문">질문</option>
          <option value="정보">정보</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">제목:</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">내용:</label>
        <textarea
          className="form-control post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">첨부파일:</label>
        <input type="file" className="form-control" onChange={handleFileChange} />
        {fileName && <div className="mt-2">업로드된 파일: {fileName}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">태그:</label>
        <input
          type="text"
          className="form-control"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary me-2">작성하기</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>작성취소</button>
    </form>
  );
};

export default PostForm;
