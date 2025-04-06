import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentList from './CommentList';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/blogs');
                setBlogs(response.data);
            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách blog:', error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2>Danh sách Blog</h2>
            {blogs.length === 0 ? (
                <p>Không có blog nào.</p>
            ) : (
                blogs.map(blog => (
                    <div key={blog._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px", borderRadius: "8px" }}>
                        <h3>{blog.content}</h3>
                        <p><strong>Người đăng:</strong> {blog.user_id?.name}</p>
                        <p><strong>Ngày đăng:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>

                        {/* Phần hiển thị ảnh */}
                        {blog.uploaded_image && (
                            <div style={{ margin: "10px 0" }}>
                                <a
                                    href={`http://localhost:5000/${blog.uploaded_image}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={`http://localhost:5000/${blog.uploaded_image}`}
                                        alt="Blog"
                                        style={{ maxWidth: "100%", borderRadius: "8px", cursor: "pointer" }}
                                    />
                                </a>
                            </div>
                        )}


                        {/* Phần hiển thị link tải file */}
                        {blog.uploaded_file && (
                            <div style={{ margin: "10px 0" }}>
                                <a
                                    href={`http://localhost:5000/${blog.uploaded_file}`}
                                    download
                                    style={{
                                        display: "inline-block",
                                        padding: "8px 12px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        textDecoration: "none"
                                    }}
                                >
                                    📄 Tải file đính kèm
                                </a>
                            </div>
                        )}

                        <CommentList blogId={blog._id} />
                    </div>
                ))
            )}
        </div>
    );
};

export default BlogList;
