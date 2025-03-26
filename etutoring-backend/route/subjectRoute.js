const express = require('express');
const router = express.Router();
const Subject = require('../../Models/Subject');

// Tạo một môn học mới
router.post('/', async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).send(subject);
    } catch (error) {
        res.status(400).send(error); // Lỗi xảy ra khi dữ liệu không hợp lệ
    }
});

// Lấy danh sách tất cả các môn học
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).send(subjects);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Lấy thông tin chi tiết một môn học theo ID
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).send();
        }
        res.status(200).send(subject);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Cập nhật thông tin một môn học theo ID
router.patch('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subject) {
            return res.status(404).send();
        }
        res.status(200).send(subject);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Xóa một môn học theo ID
router.delete('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).send();
        }
        res.status(200).send(subject);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;