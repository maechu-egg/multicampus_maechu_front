import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostForm.css";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    content: string;
    category: string;
    subcategory: string;
    tags: string[];
  };
  onSave: (title: string, content: string, category: string, subcategory: string, tags: string[]) => void;
  onCancel: () => void;
  categories: string[];
  subcategories: { [key: string]: string[] };
}

const PostForm: React.FC<PostFormProps> = ({ 
  mode, 
  initialData, 
  onSave, 
  onCancel,
  categories,
  subcategories 
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || ""); 
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "");
  const [fileName, setFileName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>(initialData?.tags || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (title.trim() === "") {
      alert("제목을 입력해주세요!");
      return;
    }
  
    if (content.trim() === "") {
      alert("내용을 입력해주세요!");
      return;
    }
  
    if (category === "") {
      alert("카테고리를 선택해주세요!");
      return;
    }
  
    if (subcategory === "") {
      alert("카테고리 소분류를 선택하세요!");
      return;
    }
  
    onSave(title, content, category, subcategory, tagList);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim() !== '') {
        const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
        if (!tagList.includes(newTag)) {
          setTagList([...tagList, newTag]);
        }
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTagList = tagList.filter(tag => tag !== tagToRemove);
    setTagList(newTagList);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h2>{mode === "create" ? "게시물 작성" : "게시물 수정"}</h2>
      <div className="mb-3">
  <label className="form-label">카테고리:</label>
  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
    <option value="">선택하세요</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>
<div className="mb-3">
  <label className="form-label">카테고리 소분류:</label>
  <select className="form-select" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
    <option value="">선택하세요</option>
    {subcategories[category]?.map((subcat) => (
      <option key={subcat} value={subcat}>
        {subcat}
      </option>
    ))}
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
        <div className="tags-input-container form-control">
          {tagList.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
              <button 
                type="button" 
                className="tag-remove-btn"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder="태그를 입력하고 Enter를 누르세요"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary me-2">
        {mode === "create" ? "작성하기" : "수정하기"}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        {mode === "create" ? "작성취소" : "수정취소"}
      </button>
    </form>
  );
};

export default PostForm;