import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import axios from 'axios';

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
}

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  onAddComment: (content: string) => void;
  onCommentDelete: (commentId: number, postId: number) => void;
 
}


const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  onAddComment,
  onCommentDelete,

}) => {
  
      const [commentInput, setCommentInput] = useState("");
      const [comment, setComment] = useState<Comment[]>([]);

      useEffect(() => {
        console.log('Comments updated:', comments);
      }, [comments]);

      useEffect(() => {
        if (postId) {
          getComments(postId);
        }
      }, [postId]);

   
      // 댓글 등록
      const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentInput.trim() !== '') {
          onAddComment(commentInput);
          setCommentInput('');
        }
      };

      // 댓글 조회
      const getComments = async (postId: number) => {
        console.log("getComment!");

        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            alert('로그인이 필요합니다.');
            return;
          }

          // 현재 로그인한 사용자 ID 가져오기
          const currentUserId = parseInt(localStorage.getItem('memberId') || '0');
          if (!currentUserId) {
            alert('사용자 정보를 가져올 수 없습니다.');
            return;
          }

          const response = await axios.get(
            `http://localhost:8001/community/comment/getComment/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log('response data', response.data);
          const serverComment = response.data; // 서버에서 반환된 새 댓글 데이터
          console.log('serverComment', serverComment);

          const newComments: Comment[] = serverComment.map((serverComment: any) => {
            return {
              id: serverComment.comments_id,
              postId: serverComment.post_id,
              author: serverComment.c_nickname ?? 'Unknown', // c_nickname이 없는 경우 기본값 설정
              content: serverComment.comments_contents,
              date: serverComment.comments_date,
              comment_like_counts: serverComment.comment_like_counts ?? 0,
              comment_dislike_counts: serverComment.comment_dislike_counts ?? 0,
              commentAuthor: serverComment.member_id === currentUserId,
              comment_like_status: serverComment.comment_like_status,
              comment_dislike_status: serverComment.comment_dislike_status,
            };
          });

          console.log('newComment', newComments);
          setComment(newComments);
        } catch (error) {
          console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
        }
      };

  

      return (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onCommentDelete={onCommentDelete}
                post_id={postId}
              />
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
              <button type="submit" className="btn btn-primary">
                작성
              </button>
            </div>
          </form>
        </div>
      );
};

export default CommentSection;
