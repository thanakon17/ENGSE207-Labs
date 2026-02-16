const studentService = require('../../business/services/studentService');

class StudentController {
    
    // Implement getAllStudents
    async getAllStudents(req, res, next) {
        try {
            // รับ query params เช่น ?major=CS&status=active
            const { major, status } = req.query;
            const result = await studentService.getAllStudents({ major, status });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement getStudentById
    async getStudentById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await studentService.getStudentById(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement createStudent
    async createStudent(req, res, next) {
        try {
            const result = await studentService.createStudent(req.body);
            // สร้างเสร็จส่ง HTTP 201 Created
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement updateStudent
    async updateStudent(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await studentService.updateStudent(id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement updateGPA
    async updateGPA(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            // รับค่า gpa จาก body
            const { gpa } = req.body;
            const result = await studentService.updateGPA(id, gpa);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement updateStatus
    async updateStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            const result = await studentService.updateStatus(id, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Implement deleteStudent
    async deleteStudent(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await studentService.deleteStudent(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();