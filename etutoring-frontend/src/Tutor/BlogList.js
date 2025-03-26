import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentList from '../compo/CommentList'; // Cập nhật đường dẫn import

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

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

    return (
        <div>
            <h1>Blog List</h1>
            {blogs.length === 0 ? (
                <p>No blogs available</p>
            ) : (
                <ul>
                    {blogs.map(blog => (
                        <li key={blog._id}>
                            <h2>{blog.title}</h2>
                            <p>{blog.content}</p>
                            <p>Visibility: {blog.visibility}</p>
                            {blog.uploaded_file && (
                                <p>Uploaded File: <a href={`http://localhost:5000/${blog.uploaded_file}`} target="_blank" rel="noopener noreferrer">{blog.uploaded_file}</a></p>
                            )}
                            <CommentList blogId={blog._id} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};



export default BlogList;