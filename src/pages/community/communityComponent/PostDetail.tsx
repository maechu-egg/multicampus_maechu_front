import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./PostDetail.css";
import { formatDate } from '../../../utils/dateFormat';  
import CommentSection from "./CommentSection";
import { usePost } from "hooks/community/usePost";
import { useAuth } from "context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";
import { useComment } from "hooks/community/useComment";


interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  comment_like_counts: number;
  comment_dislike_counts: number;
  comment_like_status: boolean;
  comment_dislike_status: boolean;
  commentAuthor: boolean;
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
}

interface PostDetailProps {
  post_id: number;
  post_title: string;
  post_contents: string;
  post_nickname: string;
  post_date: string;
  post_views: number;
  post_up_sport: string;
  post_sport: string;
  post_sports_keyword: string;
  post_hashtag: string;
  likeStatus: boolean;
  unlikeStatus: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCommentDelete: (commentId: number, postId: number) => void;
  currentUserNickname: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  post_img1?: string;
  post_img2?: string;
  post_unlike_counts: number;
  post_like_counts: number;
  commets_count: number;
  member_id: number;
  author: boolean;
  current_points : number;
  crew_current_points:number;
  member_badge_level:string;
  crew_badge_level : string;
  crew_battle_wins : number;
  onCommentLike: (commentId: number, postId: number) => void;
  onCommentDislike: (commentId: number, postId: number) => void;
  getComments: (postId: number) => Promise<void>;
  isModalOpen: boolean; // 모달 상태
  modalMessage: string; // 모달 메시지
  handleModalClose: () => void; // 모달 닫기 함수
  isConfirmModalOpen: boolean; // Confirm Modal 상태
  setIsConfirmModalOpen: (isOpen: boolean) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post_id,
  post_title,
  post_contents,
  post_nickname,
  post_date,
  post_views,
  post_up_sport,
  post_sport,
  post_sports_keyword,
  post_hashtag,
  likeStatus,
  unlikeStatus,
  onBack,
  onEdit,
  onDelete,
  onCommentDelete,
  comments,
  onAddComment,
  post_img1,
  post_img2,
  post_unlike_counts,
  post_like_counts,
  author,
  onCommentLike,
  onCommentDislike,
  getComments,
  member_badge_level,
  isModalOpen,
  modalMessage,
  handleModalClose,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
}) => {
  const { state: { token } } = useAuth();
  const [imgSrc1, setImgSrc1] = useState<string>("");
  const [imgSrc2, setImgSrc2] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [commentInput, setCommentInput] = useState("");
  const hashtagArray = post_hashtag ? post_hashtag.split(',') : [];
  const BASE_URLI = "https://workspace.kr.object.ncloudstorage.com/";
  const [commentss, setCommentss] = useState<Comment[]>([]);

  const badgeImages: { [key: string]: string } = {
    다이아몬드: '/img/personalBadge/badgeDiamond.png',
    플래티넘: '/img/personalBadge/badgePlatinum.png',
    골드: '/img/personalBadge/badgeGold.png',
    실버: '/img/personalBadge/badgeSilver.png',
    브론즈: '/img/personalBadge/badgeBronze.png',
    기본: '/img/personalBadge/badgeDefault.png',
  };
  
  const getBadgeImage = (level: string): string => {
    return badgeImages[level] || badgeImages['기본'];
  };
  const badgeImage = getBadgeImage(member_badge_level);

  const { 
    liked, 
    setLiked,
    disliked, 
    setDisliked,
    likeCount, 
    setLikeCount,
    dislikeCount, 
    setDislikeCount,
    handleLike, 
    handleDislike 
  } = usePost();

  const {
    comments: commentList,
    setComments,
    showAlertModal,
    setShowAlertModal,
    alertMessage,
    setAlertMessage,
    handleCommentDelete,
  } = useComment();

  useEffect(() => {
    setLikeCount(post_like_counts);
    setDislikeCount(post_unlike_counts);
    setLiked(likeStatus);
    setDisliked(unlikeStatus);
  }, [post_like_counts, post_unlike_counts, likeStatus, unlikeStatus, setLikeCount, setDislikeCount, setLiked, setDisliked]);

  useEffect(() => {
    const fetchComments = async () => {
      await getComments(post_id);
    };
    fetchComments();
  }, [post_id]);

  const handleCancel = () => {
    console.log("삭제 취소됨");
    setIsConfirmModalOpen(false);
  };
  
  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };
  
  // useEffect(() => {
  //   const loadImage = async (imgUrl: string | undefined) => {
  //     if (!imgUrl || !token) return null;
  //     try {
  //       const response = await fetch(imgUrl, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       if (response.ok) {
  //         const blob = await response.blob();
  //         return URL.createObjectURL(blob);
  //       }
  //     } catch (error) {
  //       console.error("이미지 로드 중 오류:", error);
  //     }
  //     return null;
  //   };

  //   const loadImages = async () => {
  //     if (post_img1) {
  //       const url1 = await loadImage(post_img1); // post_img1은 이미 전체 URL
  //       if (url1) setImgSrc1(url1);
  //     }
  //     if (post_img2) {
  //       const url2 = await loadImage(post_img2); // post_img2는 이미 전체 URL
  //       if (url2) setImgSrc2(url2);
  //     }
  //   };

  //   loadImages();

  //   // cleanup
  //   return () => {
  //     if (imgSrc1) URL.revokeObjectURL(imgSrc1);
  //     if (imgSrc2) URL.revokeObjectURL(imgSrc2);
  //   };
  // }, [post_img1, post_img2, token]);

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  
  return (
    <div className="post-detail">
      <input type="hidden" value={post_id} />
      
      <div className="post-category">
        {post_up_sport} 게시판 - {post_sport} - {post_sports_keyword}
      </div>

      <hr className="border border-secondary border-1 opacity-50" />

      <div className="post-header">
        <h2>{post_title}</h2>
        <div className="post-info">
          <span className="author">{post_nickname}
          <img src={badgeImage} alt={`${member_badge_level} badge`} className="member_badge_img" /> 
          </span>
          <div className="info-right">
            <span className="date">{formatDate(post_date)}</span>
            <span className="views">조회수: {post_views}</span>
          </div>
        </div>
      </div>

      <hr className="border border-secondary border-1 opacity-50" />

      {author && (
        <div id="edit-delete-buttons">
          <button id="edit-button" className="btn btn-primary" onClick={onEdit}>
            수정
          </button>
          {/* <button id="delete-button" className="btn btn-danger" onClick={onDelete}>
            삭제
          </button> */}
            <button id="delete-button" className="btn btn-danger" 
                    onClick={() => setIsConfirmModalOpen(true)}
            >
            삭제
          </button>
          <ConfirmModal
              isOpen={isConfirmModalOpen}
              title="⚠️ 게시글 삭제"
              message="정말로 이 게시글을 삭제하시겠습니까?"
              // onConfirm={onDelete}
              // onCancel={handleCancel}
              onConfirm={() => onDelete()} // 삭제 함수 호출
              onCancel={() => setIsConfirmModalOpen(false)} // ConfirmModal 닫기
          />
                  <AlertModal
                    isOpen={isModalOpen}
                    message={modalMessage}
                    onClose={handleModalClose} // 수정된 handleModalClose 사용
          />

        </div>
      )}

      <div className="post-content">{post_contents}</div>

      <div className="post-images">
        {post_img1 && (
          <div className="post-image">
            <img
              src={`${BASE_URLI}${post_img1}`}
              alt="게시글 이미지 1"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        {post_img2 && (
          <div className="post-image">
            <img
              src={`${BASE_URLI}${post_img2}`}
              alt="게시글 이미지 2"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>

      {hashtagArray.length > 0 && (
        <div className="post-tags">
          {hashtagArray.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="reaction-buttons">
        <div className="like-dislike-buttons">
          <button
            className={`btn ${liked ? "btn-primary" : "btn-outline-primary"} me-2`}
            onClick={() => handleLike(post_id)}
          >
            <FaThumbsUp /> {likeCount}
          </button>
          <button
            className={`btn ${disliked ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => handleDislike(post_id)}
          >
            <FaThumbsDown /> {dislikeCount}
          </button>
        </div>
        <button id="back-button" className="btn btn-secondary" onClick={onBack}>
          뒤로가기
        </button>
      </div>

      <hr className="mt-4" />
      <div className="comments-section">
        <div className="comment-sort-buttons">
          <button
            className={`btn btn-sm ${
              sortOrder === "asc" ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={() => handleSortOrderChange("asc")}
          >
            등록순
          </button>
          <button
            className={`btn btn-sm ${
              sortOrder === "desc" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleSortOrderChange("desc")}
          >
            최신순
          </button>
        </div>

        <CommentSection
          comments={sortedComments}
          postId={post_id}
          onAddComment={onAddComment}
          onCommentDelete={onCommentDelete}
          onCommentLike={onCommentLike}
          onCommentDislike={onCommentDislike}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          showAlertModal={showAlertModal}
          alertMessage={alertMessage}
          setShowAlertModal={setShowAlertModal}
          
        />
      </div>
    </div>
  );
};

export default PostDetail;