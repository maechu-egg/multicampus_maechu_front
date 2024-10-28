import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";

interface PostDetailProps {
  title: string;
  content: string;
  author: string;
  date: string;
  onBack: () => void;
}

interface Comment {
  author: string;
  content: string;
  date: string;
  likeCount: number;
  dislikeCount: number;
}

const PostDetail: React.FC<PostDetailProps> = ({
  title,
  content,
  author,
  date,
  onBack,
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 상태
  const [commentInput, setCommentInput] = useState(""); // 댓글 입력 상태
  const [commentAuthor, setCommentAuthor] = useState("");

  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleDislike = () => {
    setDislikeCount(dislikeCount + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim() !== "" && commentAuthor.trim() !== "") {
      const newComment: Comment = {
        author: commentAuthor,
        content: commentInput,
        date: new Date().toLocaleDateString(),
        likeCount: 0,
        dislikeCount: 0,
      };
      setComments([...comments, newComment]);
      setCommentInput("");
      setCommentAuthor("");
    }
  };

  const handleCommentLike = (index: number) => {
    const newComments = [...comments];
    newComments[index].likeCount += 1;
    setComments(newComments);
  };

  const handleCommentDislike = (index: number) => {
    const newComments = [...comments];
    newComments[index].dislikeCount += 1;
    setComments(newComments);
  };

  return (
    <div className="post-detail">
      <h2>{title}</h2>
      <p>
        작성자: {author} | 날짜: {date}
      </p>

      <hr className="mt-2" />
      <div className="reaction-buttons">
        <p>{content}</p>
        <br className="mt-5" />

        <button onClick={handleLike} className="btn btn-light">
          <FaThumbsUp /> {likeCount}
        </button>
        <button onClick={handleDislike} className="btn btn-light">
          <FaThumbsDown /> {dislikeCount}
        </button>
      </div>
      <hr className="mt-2" />
      <button onClick={onBack} className="btn btn-secondary">
        뒤로가기
      </button>

      <hr className="mt-3" />
      <h4>댓글</h4>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentAuthor}
          onChange={(e) => setCommentAuthor(e.target.value)}
          placeholder="작성자 이름"
          className="form-control mb-2"
        />
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          댓글 작성
        </button>
      </form>
      <ul className="mt-3">
        {comments.map((comment, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>
              <strong>{comment.author}</strong> | {comment.date}
            </p>
            <p>{comment.content}</p>
            <button
              onClick={() => handleCommentLike(index)}
              className="btn btn-light"
            >
              <FaThumbsUp /> {comment.likeCount}
            </button>
            <button
              onClick={() => handleCommentDislike(index)}
              className="btn btn-light"
            >
              <FaThumbsDown /> {comment.dislikeCount}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
