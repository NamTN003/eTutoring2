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
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/comments/${blogId}`);
        setComments(response.data);
      } catch (error) {
        console.error('❌ Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/comments`, {
        blog_id: blogId,
        user_id: userId,
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <div className="comment-body">
        <div className="comment-scroll" ref={scrollRef}>
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
            placeholder="Add a comment..."
            required
            className="comment-input"
          />
          <button type="submit" className="comment-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default CommentList;
