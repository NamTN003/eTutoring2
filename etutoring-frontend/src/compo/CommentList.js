import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const userId = localStorage.getItem('userId');

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
        } catch (error) {
            console.error('❌ Lỗi khi thêm comment:', error);
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h4>Bình luận</h4>
            <ul>
                {comments.map(comment => (
                    <li key={comment._id} style={{ marginBottom: "10px" }}>
                        <strong>{comment.user_name }:</strong> {comment.content}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <button type="submit" style={{ padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px" }}>
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default CommentList;