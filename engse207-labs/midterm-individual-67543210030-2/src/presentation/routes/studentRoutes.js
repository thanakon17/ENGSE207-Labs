const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Define routes

// GET /api/students - ดึงทั้งหมด
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - ดึงรายคน
router.get('/:id', studentController.getStudentById);

// POST /api/students - เพิ่มนักศึกษา
router.post('/', studentController.createStudent);

// PUT /api/students/:id - แก้ไขข้อมูลหลัก
router.put('/:id', studentController.updateStudent);

// PATCH /api/students/:id/gpa - แก้เกรดเฉลี่ย
router.patch('/:id/gpa', studentController.updateGPA);

// PATCH /api/students/:id/status - เปลี่ยนสถานะ
router.patch('/:id/status', studentController.updateStatus);

// DELETE /api/students/:id - ลบนักศึกษา
router.delete('/:id', studentController.deleteStudent);

module.exports = router;