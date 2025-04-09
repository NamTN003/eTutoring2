import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CommentList.css';

const CommentList = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const userId = localStorage.getItem('userId');
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
                setComments(response.data);
            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách comment:', error);
            }
        };

        fetchComments();
    }, [blogId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/comments', {
                blog_id: blogId,
                user_id: userId,
                content: newComment,
            });
            setComments([...comments, response.data]);
            setNewComment('');

            // Cuộn xuống bình luận mới nhất
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('❌ Lỗi khi thêm comment:', error);
        }
    };

    return (
        <div className="comment-section">
    <h4>Bình luận</h4>
    <div className="comment-body">
        <div className="comment-scroll">
            <ul className="comment-list">
                {comments.map(comment => (
                    <li key={comment._id} className="comment-item">
                        <strong>{comment.user_name}:</strong> {comment.content}
                    </li>
                ))}
            </ul>
        </div>
        <form onSubmit={handleAddComment} className="comment-form">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận..."
                required
                className="comment-input"
            />
            <button type="submit" className="comment-button">Gửi</button>
        </form>
    </div>
</div>
    );
};

export default CommentList;