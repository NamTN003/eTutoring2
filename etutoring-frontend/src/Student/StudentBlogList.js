import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogDetailModal from '../compo/BlogDetailModal';

const StudentBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/blogs');
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const openModal = (blogId) => {
        setSelectedBlogId(blogId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBlogId(null);
        setIsModalOpen(false);
    };

    return (
        <div className="blog-list">
            <h1>Blog List</h1>
            {blogs.length === 0 ? (
                <p>No blogs available</p>
            ) : (
                <ul>
                    {blogs.map(blog => (
                        <li key={blog._id} className="blog-item">
                            <h2>{blog.title}</h2>
                            <p>{blog.content}</p>
                            <p>Visibility: {blog.visibility}</p>
                            {blog.uploaded_file && (
                                <p>Uploaded File: <a href={`http://localhost:5000/uploads/${blog.uploaded_file}`} target="_blank" rel="noopener noreferrer">{blog.uploaded_file}</a></p>
                            )}
                            <button onClick={() => openModal(blog._id)}>Read More</button>
                        </li>
                    ))}
                </ul>
            )}
            <BlogDetailModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                blogId={selectedBlogId}
            />
        </div>
    );
};

export default StudentBlogList;