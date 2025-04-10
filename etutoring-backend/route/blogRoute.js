const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('../Models/Blogs');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file: 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh (JPEG, JPG, PNG) hoặc tài liệu (PDF, DOC, DOCX, TXT)!'));
        }
    }
});

router.post('/', upload.fields([{ name: 'uploaded_file' }, { name: 'uploaded_image' }]), async (req, res) => {
    try {
        const { user_id, content, visibility } = req.body;
        const uploadedFile = req.files['uploaded_file'] ? req.files['uploaded_file'][0].filename : null;
        const uploadedImage = req.files['uploaded_image'] ? req.files['uploaded_image'][0].filename : null;

        if (!user_id || !content || !visibility) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
        }

        const blog = new Blog({
            user_id,
            content,
            visibility,
            uploaded_file: uploadedFile ? `uploads/${uploadedFile}` : null,
            uploaded_image: uploadedImage ? `uploads/${uploadedImage}` : null,
        });

        await blog.save();
        res.status(201).json({ message: "Blog đã được tạo thành công!", blog });
    } catch (error) {
        console.error("❌ Lỗi khi tạo blog:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});
// Read all blogs
router.get('/', async (req, res) => {
    try {
        // Lấy danh sách tất cả blogs và populate thông tin user (name, email)
        const blogs = await Blog.find({})
            .populate({
                path: 'user_id', // Trường tham chiếu đến bảng User
                select: 'name email' // Chỉ lấy các trường name và email
            });

        // Trả về danh sách blogs
        res.status(200).json({
            success: true,
            message: "Lấy danh sách blogs thành công!",
            data: blogs
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách blogs:", error);

        // Trả về lỗi server
        res.status(500).json({
            success: false,
            message: "Lỗi server!",
            error: error.message
        });
    }
});

// Read a single blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('user_id', 'name email');
        if (!blog) {
            return res.status(404).send();
        }
        res.status(200).send(blog);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a blog by ID
router.patch('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blog) {
            return res.status(404).send();
        }
        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send(error);
    }
});



// Delete a blog by ID
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).send();
        }
        res.status(200).send(blog);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({
            visibility: { $in: ['all', 'student'] }
        });
        res.status(200).send(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
});

//tạo thêm comment cho blogs:
//-làm crud cho comment y như crud cho blogs(crud cho comment lưu lại id của blogs muốn comment)
//-xử lý frontend cho comment là làm 1 form add comment trong phần đọc blogs, sau đó khi add comment 
//thì chỉ cần lưu lại id của current blog và content của comment

module.exports = router;