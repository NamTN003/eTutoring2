import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentList from './CommentList';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blogs');
        setBlogs(response.data.data);
      } catch (error) {
        console.error('❌ Error fetching blog list:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blog-wrapper">
      <h2>Blog List</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="blog-list">
          {blogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <h3>{blog.content}</h3>
              <p><strong>Author:</strong> {blog.user_id.name} ({blog.user_id.email})</p>
              <p><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>

              {blog.uploaded_image && (
                <div className="blog-image">
                  <a
                    href={`http://localhost:5000/${blog.uploaded_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:5000/${blog.uploaded_image}`}
                      alt="Blog"
                    />
                  </a>
                </div>
              )}

              {blog.uploaded_file && (
                <div className="blog-download">
                  <a
                    href={`http://localhost:5000/${blog.uploaded_file}`}
                    download
                  >
                    📄 Download attachment
                  </a>
                </div>
              )}

              <div className="comment-section">
                <CommentList blogId={blog._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
