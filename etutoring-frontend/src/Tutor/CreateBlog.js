import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css'; // 👈 Thêm file CSS

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
            setContent('');
            setVisibility('all');
            setUploadedFile(null);
            setUploadedImage(null);
        } catch (error) {
            console.error('❌ Error creating blog:', error);
            alert('❌ Lỗi khi tạo blog!');
        }
    };

    return (
        <div className="create-blog-wrapper">
            <h2>✍️ Tạo Blog Mới</h2>
            <form className="create-blog-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nội dung:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Nhập nội dung blog..."
                    />
                </div>

                <div className="form-group">
                    <label>Đối tượng hiển thị:</label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        required
                    >
                        <option value="all">Tất cả</option>
                        <option value="student">Sinh viên</option>
                        <option value="tutor">Gia sư</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Tải tệp đính kèm:</label>
                    <input
                        type="file"
                        onChange={(e) => setUploadedFile(e.target.files[0])}
                    />
                </div>

                <div className="form-group">
                    <label>Tải ảnh minh họa:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadedImage(e.target.files[0])}
                    />
                </div>

                <button type="submit">📢 Đăng Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
