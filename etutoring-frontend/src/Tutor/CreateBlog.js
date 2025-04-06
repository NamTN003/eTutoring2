import React, { useState } from 'react';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:5000/blogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('✅ Blog created successfully:', response.data);
            alert('✅ Blog đã được tạo thành công!');
        } catch (error) {
            console.error('❌ Error creating blog:', error);
            alert('❌ Lỗi khi tạo blog!');
        }
    };

    return (
        <div>
            <h1>Create Blog</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Visibility:</label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        required
                    >
                        <option value="all">All</option>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>
                </div>
                <div>
                    <label>Upload File:</label>
                    <input
                        type="file"
                        onChange={(e) => setUploadedFile(e.target.files[0])}
                    />
                </div>
                <div>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadedImage(e.target.files[0])}
                    />
                </div>
                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;