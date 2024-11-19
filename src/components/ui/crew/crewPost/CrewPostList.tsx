import React from "react";
import CrewPostItem from "./CrewPostItem";

interface Post {
    crew_post_id: number;
    crew_post_title: string;
    crew_post_contents: string;
    crwe_post_img: string;
    crew_post_like: number;
    crew_post_state: number;
    crew_post_date : string;
    crew_id: number;
    nickname: string;
    member_id: number;
}

interface PostListProps {
    posts: Post[];
    onPostClick: (post: Post) => void;
}

function CrewPostList({ posts, onPostClick }: PostListProps) {
    return (
        <div>
            {/* 전체 게시글 */}
            {posts.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                posts.map((post) => (
                    <CrewPostItem key={post.crew_post_id} {...post} onClick={() => onPostClick(post)} />
                ))
            )}
        </div>
    );
};

export default CrewPostList;