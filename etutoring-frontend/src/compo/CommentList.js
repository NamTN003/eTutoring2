import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ blogId }) => {
    const userloggedIn = localStorage.getItem('userId');
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/${blogId}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/comments', {
                blog_id: blogId,
                user_id: userloggedIn, // Thay thế bằng user_id thực tế
                content
            });
            setComments([...comments, response.data]);
            setContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment._id}>
                        <p>{comment.content}</p>
                        <small>By: {comment.user_name}</small> {/* Sử dụng user_name */}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
};

export default CommentList;