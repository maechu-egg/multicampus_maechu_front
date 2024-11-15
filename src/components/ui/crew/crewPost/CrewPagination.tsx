import React from 'react';
import './Pagination.css';


/* 페이지네이션 컴포넌트 */
interface PaginationProps {
  currentPage: number;   // 현재 페이지 번호
  totalPages: number; //전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 핸들러
}

const CrewPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center">
        {/* 이전 페이지 버튼 */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
        </li>

        {/* 페이지 번호 버튼들 */}
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index + 1}
            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        
        {/* 다음 페이지 버튼 */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default CrewPagination;