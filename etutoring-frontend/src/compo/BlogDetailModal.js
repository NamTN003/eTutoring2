import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import CommentList from './CommentList';
import './BlogDetailModal.css'; // Import file CSS

const BlogDetailModal = ({ isOpen, onRequestClose, blogId }) => {
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        if (blogId) {
            const fetchBlog = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/blogs/${blogId}`);
                    setBlog(response.data);
                } catch (error) {
                    console.error('Error fetching blog:', error);
                }
            };

            fetchBlog();
        }
    }, [blogId]);

    if (!blog) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
            <div className="modal-content">
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                <p>Visibility: {blog.visibility}</p>
                {blog.uploaded_file && (
                    <p>Uploaded File: <a href={`http://localhost:5000/uploads/${blog.uploaded_file}`} target="_blank" rel="noopener noreferrer">{blog.uploaded_file}</a></p>
                )}
                <CommentList blogId={blog._id} />
                <button onClick={onRequestClose} className="close-button">Close</button>
            </div>
        </Modal>
    );
};

export default BlogDetailModal;

