import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostForm.css";
import AlertModal from "./AlertModal";
import { useNavigate } from "react-router-dom";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: {
    post_title: string;
    post_contents: string;
    post_up_sport: string;
    post_sport: string;
    post_hashtag: string;
    post_sports_keyword: string;
    post_img1?: string;  
    post_img2?: string;  
  };
  onSave: (
    post_title: string,
    post_contents: string,
    post_up_sport: string,
    post_sport: string,
    post_hashtag: string,
    post_sports_keyword: string,
    imageFiles: File[] | null,
    existingImages : string[],
  ) => void;
  onCancel: () => void;
  post_up_sports: string[];
  post_sports: { [key: string]: string[] };
  recommendedKeywords: string[];
  isModalOpen: boolean; // 모달 상태
  modalMessage: string; // 모달 메시지
  handleModalClose: () => void; // 모달 닫기 함수
}

const PostForm: React.FC<PostFormProps> = ({
  mode,
  initialData,
  onSave,
  onCancel,
  post_up_sports,
  post_sports,
  recommendedKeywords,
  isModalOpen,
  modalMessage,
  handleModalClose,
}) => {
  const [post_title, setPost_title] = useState(initialData?.post_title || "");
  const [post_contents, setPost_contents] = useState(initialData?.post_contents || "");
  const [post_up_sport, setPost_up_sport] = useState(initialData?.post_up_sport || "");
  const [post_sport, setPost_sport] = useState(initialData?.post_sport || "");
  const [post_sports_keyword, setPost_sports_keyword] = useState(initialData?.post_sports_keyword || "");
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [tagInput, setTagInput] = useState("");
  // const [keywordTag, setKeywordTag] = useState<string>("");
  const [keywordTag, setKeywordTag] = useState<string>(
    initialData?.post_sports_keyword ? `#${initialData.post_sports_keyword}` : ""
  );
  const [customTags, setCustomTags] = useState<string[]>(
    initialData?.post_hashtag ? 
      initialData.post_hashtag.split(", ").filter(tag => !recommendedKeywords.includes(tag.replace('#', ''))) 
      : []
  );

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const maxLength = 30;
  const maxTags = 10;

  // 초기 이미지 파일명들을 저장할 state 추가
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    const images = [];
    if (initialData?.post_img1) {
      // URL이 아닌 파일명만 저장
      images.push(initialData.post_img1);
    }
    if (initialData?.post_img2) {
      // URL이 아닌 파일명만 저장
      images.push(initialData.post_img2);
    }
    return images;
  });
  // 타임스탬프를 제거하고 원래 파일명만 추출하는 함수
  const getOriginalFileName = (filename: string) => {
    const parts = filename.split('_');
    if (parts.length > 1) {
      // 첫 번째 부분(타임스탬프)를 제외한 나머지를 합침
      return parts.slice(1).join('_');
    }
    return filename;
  };
  // 새로운 이미지 파일 삭제 함수
  const removeNewImage = (indexToRemove: number) => {
    if (imageFiles) {
      const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
      setImageFiles(newImageFiles.length > 0 ? newImageFiles : null);
    }
  };

  // 기존 이미지 파일 삭제 함수
  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };


  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const newFiles = Array.from(e.target.files);
  //     const totalFiles = [...(imageFiles || []), ...newFiles];
  
  //     if (totalFiles.length > 2) {
  //       alert("최대 2개의 이미지만 업로드할 수 있습니다.");
  //       return;
  //     }
  
  //     setImageFiles(totalFiles);
  //     setError(""); // 이미지가 업로드되면 에러 메시지 초기화
  //   }
  // };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 기존 이미지가 있으면 업로드 차단
    if (existingImages.length > 0) {
      alert("기존 이미지가 있으므로 새로운 이미지를 업로드할 수 없습니다.");
      return;
    }
  
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]; // 단일 파일만 선택
      setImageFiles(selectedFile ? [selectedFile] : null); // 배열로 저장 형태 유지
      setError(""); // 이미지가 업로드되면 에러 메시지 초기화
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // 제출 시 에러 메시지 초기화

    if (post_title.trim() === "") {
      alert("제목을 입력해주세요!");
      return;
    }

    if (post_contents.trim() === "") {
      alert("내용을 입력해주세요!");
      return;
    }

    if (post_up_sport === "") {
      alert("카테고리를 선택해주세요!");
      return;
    }

    if (post_sport === "") {
      alert("카테고리 소분류를 선택하세요!");
      return;
    }

    // 오운완 키워드 선택 시 이미지 필수 체크
    if (post_sports_keyword === "오운완" && (!imageFiles || imageFiles.length === 0) && existingImages.length === 0) {
      setError("오운완 게시물은 이미지를 필수로 첨부해야 합니다.");
      return;
    }

    const allTags = [keywordTag, ...customTags].filter(tag => tag !== "").join(", ");

    onSave(
      post_title,
      post_contents,
      post_up_sport,
      post_sport,
      post_sports_keyword,
      allTags,
      imageFiles,
      existingImages, 
    );
  };


  // const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     if (tagInput.trim() !== '') {
  //       const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
  //       if (!customTags.includes(newTag) && newTag !== keywordTag) {
  //         setCustomTags([...customTags, newTag]);
  //       }
  //       setTagInput('');
  //     }
  //   }
  // };
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim() !== '') {
        const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
        if (customTags.length <maxTags  && !customTags.includes(newTag) && newTag !== keywordTag) {
          setCustomTags([...customTags, newTag]);
        } 
        setTagInput('');
      }
    }
  };




  const removeTag = (tagToRemove: string) => {
    // 키워드 태그는 삭제할 수 없음
    if (tagToRemove === keywordTag) return;
    
    const newCustomTags = customTags.filter(tag => tag !== tagToRemove);
    setCustomTags(newCustomTags);
  };


  const handleKeywordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKeyword = e.target.value;
    setPost_sports_keyword(selectedKeyword);
    setError("");
    
    // 키워드 태그 설정
    if (selectedKeyword) {
      setKeywordTag(`#${selectedKeyword}`);
    } else {
      setKeywordTag("");
    }
  };

  // 버튼 비활성화 함수
  const isSubmitDisabled = () => {
    return post_sports_keyword === "오운완" && 
           (!imageFiles || imageFiles.length === 0) && 
           existingImages.length === 0;
  };

  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // 최대 글자수를 초과하지 않도록 설정
    if (inputValue.length <= maxLength) {
        setPost_title(inputValue);
    }
};

useEffect(() => {
    // 초기 데이터가 변경되었을 때에도 반영
    if (initialData?.post_title) {
        setPost_title(initialData.post_title);
    }
}, [initialData]);

  return (
    <div className="post-form-container">
      <h2 className="form-title">{mode === "create" ? "게시물 작성" : "게시물 수정"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">카테고리:</label>
          <select 
            className="form-select" 
            value={post_up_sport} 
            onChange={(e) => setPost_up_sport(e.target.value)} 
            required
          >
            <option value="">선택하세요</option>
            {post_up_sports.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">카테고리 소분류:</label>
          <select 
            className="form-select" 
            value={post_sport} 
            onChange={(e) => setPost_sport(e.target.value)}
          >
            <option value="">선택하세요</option>
            {post_sports[post_up_sport]?.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">키워드:</label>
          <select 
            className="form-select" 
            value={post_sports_keyword} 
            onChange={handleKeywordChange}  
          >
            <option value="">선택하세요</option>
            {recommendedKeywords?.map((keyword) => (
              <option key={keyword} value={keyword}>
                {keyword}
              </option>
            ))}
          </select>
          {post_sports_keyword === "오운완" && (
            <small className="text-muted">
              * 오운완 게시물은 이미지 첨부가 필수입니다.
            </small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">제목:</label>
          <input
            type="text"
            className="form-control"
            value={post_title}
            // onChange={(e) => setPost_title(e.target.value)}
            onChange={handleInputChange}

            placeholder="제목을 입력하세요"
            maxLength={maxLength}
          />
           <p className = "post_length">
                {post_title.length}/{maxLength} 글자
            </p>
        </div>

        <div className="mb-3">
          <label className="form-label">내용:</label>
          <textarea
            className="form-control post-content"
            value={post_contents}
            onChange={(e) => setPost_contents(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            이미지 업로드:
            {post_sports_keyword === "오운완" && (
              <span className="text-danger ms-1">*필수</span>
            )}
          </label>
          <input 
            type="file" 
            className="form-control" 
            multiple 
            onChange={handleImageChange}
            accept="image/*"
          />
          {(imageFiles || existingImages.length > 0) && (
            <div className="mt-2">
              업로드된 파일:
              <ul className="list-unstyled">
                {existingImages.map((filename, index) => (
                  <li key={`existing-${index}`} className="d-flex align-items-center mb-1">
                    <span>{getOriginalFileName(filename)}</span>
                    <button
                      type="button"
                      className="btn btn-sm text-danger ms-2"
                      onClick={() => removeExistingImage(index)}
                      style={{ padding: '0 5px', fontSize: '18px', border: 'none', background: 'none' }}
                    >
                      ×
                    </button>
                  </li>
                ))}
                {imageFiles?.map((file, index) => (
                  <li key={`new-${index}`} className="d-flex align-items-center mb-1">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm text-danger ms-2"
                      onClick={() => removeNewImage(index)}
                      style={{ padding: '0 5px', fontSize: '18px', border: 'none', background: 'none' }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
              <label className="form-label">태그:</label>
              <div className="tags-input-container">
                {/* 키워드 태그 표시 */}
                {keywordTag && (
                  <span className="tag-item me-2 keyword-tag">
                    {keywordTag}
                  </span>
                )}
                {/* 커스텀 태그 표시 */}
                {customTags.map((tag, index) => (
                  <span key={index} className="tag-item me-2">
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
          className="tag-input border-0"
          placeholder="태그를 입력하고 Enter를 누르세요. (최대 10개)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
        
      </div>
      <p className="post_length">
      {keywordTag ? customTags.length + 1 : customTags.length}/{maxTags} 태그
      </p>
    </div>

    <div className="d-flex justify-content-end gap-2">
      <button 
        type="submit" 
        id="postform-submit-btn" 
        className={`btn btn-primary ${isSubmitDisabled() ? 'disabled' : ''}`}
        disabled={isSubmitDisabled()}
      >
        {mode === "create" ? "작성하기" : "수정하기"}
      </button>
          <AlertModal
                    isOpen={isModalOpen}
                    message={modalMessage}
                    onClose={handleModalClose} 
          />
      <button 
        type="button" 
        id="postform-cancel-btn" 
        className="btn btn-secondary" 
        onClick={onCancel}
      >
        {mode === "create" ? "작성취소" : "수정취소"}
      </button>
    </div>
      </form>
    </div>
  );
};

export default PostForm;