const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {

    // Implement getAllStudents
    async getAllStudents(filters = {}) {
        // 1. เรียก studentRepository
        // filters คือ object { major, status } ที่รับมาจาก Controller
        const students = await studentRepository.findAll(filters);

        // 2. คำนวณสถิติ (Logic ย้ายมาจาก Monolith)
        const active = students.filter(s => s.status === 'active').length;
        const graduated = students.filter(s => s.status === 'graduated').length;
        const suspended = students.filter(s => s.status === 'suspended').length;
        const avgGPA = students.length > 0 
            ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
            : 0;

        // 3. return ผลลัพธ์พร้อมสถิติ
        return {
            students,
            statistics: { 
                active, 
                graduated, 
                suspended, 
                total: students.length,
                averageGPA: parseFloat(avgGPA)
            }
        };
    }

    // Implement getStudentById
    async getStudentById(id) {
        // 1. Validate ID
        studentValidator.validateId(id);

        // 2. เรียก repository
        const student = await studentRepository.findById(id);
        
        // 3. ถ้าไม่เจอ throw Error
        if (!student) {
            throw new Error('Student not found');
        }

        // 4. return student
        return student;
    }

    // Implement createStudent
    async createStudent(studentData) {
        // 1-4. Validate ข้อมูลทั้งหมดผ่าน Validator
        studentValidator.validateStudentData(studentData);

        // 5. เรียก repository เพื่อบันทึก
        // (หมายเหตุ: ถ้า student_code หรือ email ซ้ำ Repository จะ throw error ออกมาเอง 
        // ซึ่งเราจะไปดักจับที่ Controller หรือ ErrorHandler)
        return await studentRepository.create(studentData);
    }

    // Implement updateStudent (ให้นักศึกษาเขียนเอง - เฉลย)
    async updateStudent(id, studentData) {
        // 1. Validate ID
        studentValidator.validateId(id);

        // 2. ตรวจสอบว่ามีนักเรียนคนนี้อยู่จริงไหม (Reuse logic ของ getStudentById)
        await this.getStudentById(id);

        // 3. Validate ข้อมูลใหม่
        studentValidator.validateStudentData(studentData);

        // 4. อัปเดตข้อมูล
        return await studentRepository.update(id, studentData);
    }

    // Implement updateGPA
    async updateGPA(id, gpa) {
        // 1. Validate ID และ GPA Range
        studentValidator.validateId(id);
        studentValidator.validateGPA(gpa);

        // 2. ตรวจสอบว่ามีนักเรียนอยู่จริง
        await this.getStudentById(id);

        // 3. อัปเดตและคืนค่า
        return await studentRepository.updateGPA(id, gpa);
    }

    // Implement updateStatus
    async updateStatus(id, status) {
        // 1. Validate ID และ Status enum
        studentValidator.validateId(id);
        studentValidator.validateStatus(status);

        // 2. ดึงข้อมูลนักศึกษาเดิมเพื่อเช็ค Business Rule
        const student = await this.getStudentById(id);

        // 3. Business Rule: ห้ามเปลี่ยนสถานะคนที่ลาออก (withdrawn) ไปแล้ว
        if (student.status === 'withdrawn') {
            throw new Error('Cannot change status of withdrawn student');
        }

        // 4. อัปเดต
        return await studentRepository.updateStatus(id, status);
    }

    // Implement deleteStudent
    async deleteStudent(id) {
        // 1. Validate ID
        studentValidator.validateId(id);

        // 2. ดึงข้อมูลเพื่อเช็ค Business Rule
        const student = await this.getStudentById(id);

        // 3. Business Rule: ห้ามลบนักศึกษาที่ยังเรียนอยู่ (active)
        if (student.status === 'active') {
            throw new Error('Cannot delete active student. Change status first.');
        }

        // 4. ลบข้อมูล
        await studentRepository.delete(id);
        return { message: 'Student deleted successfully' };
    }
}

module.exports = new StudentService();