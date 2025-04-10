import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css'; // 👈 Add CSS file

const CreateBlog = () => {
    const userid = localStorage.getItem("userId");
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('all');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user_id', userid);
        formData.append('content', content);
        formData.append('visibility', visibility);
        if (uploadedFile) {
            formData.append('uploaded_file', uploadedFile);
        }
        if (uploadedImage) {
            formData.append('uploaded_image', uploadedImage);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/blogs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('✅ Blog created successfully:', response.data);
            alert('✅ Blog has been created successfully!');
            setContent('');
            setVisibility('all');
            setUploadedFile(null);
            setUploadedImage(null);
        } catch (error) {
            console.error('❌ Error creating blog:', error);
            alert('❌ Error creating blog!');
        }
    };

    return (
        <div className="create-blog-wrapper">
            <h2>✍️ Create a New Blog</h2>
            <form className="create-blog-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Enter blog content..."
                    />
                </div>

                <div className="form-group">
                    <label>Visibility:</label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        required
                    >
                        <option value="all">Everyone</option>
                        <option value="student">Students</option>
                        <option value="tutor">Tutors</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Upload Attachment:</label>
                    <input
                        type="file"
                        onChange={(e) => setUploadedFile(e.target.files[0])}
                    />
                </div>

                <div className="form-group">
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadedImage(e.target.files[0])}
                    />
                </div>

                <button type="submit">📢 Post Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
