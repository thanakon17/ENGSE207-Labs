class StudentValidator {
    validateStudentData(data) {
        const { student_code, first_name, last_name, email, major } = data;
        
        // ตรวจสอบว่ามีข้อมูลครบหรือไม่
        if (!student_code || !first_name || !last_name || !email || !major) {
            throw new Error('All fields are required'); // ส่ง Error กลับไปถ้าข้อมูลไม่ครบ
        }
        
        // เรียกใช้ฟังก์ชันตรวจสอบย่อย เพื่อความละเอียด
        this.validateStudentCode(student_code);
        this.validateEmail(email);
        this.validateMajor(major);
        return true;
    }
    
    validateStudentCode(code) {
        // Format: ตัวเลข 10 หลัก
        const codePattern = /^\d{10}$/;
        
        if (!codePattern.test(code)) {
            throw new Error('Invalid student code format (must be 10 digits)');
        }
        return true;
    }
    
    validateEmail(email) {
        // Format Email มาตรฐาน
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(email)) {
            throw new Error('Invalid email format');
        }
        return true;
    }
    
    validateMajor(major) {
        // ต้องเป็นหนึ่งในค่าที่กำหนด
        const validMajors = ['CS', 'SE', 'IT', 'CE', 'DS'];
        
        if (!validMajors.includes(major)) {
            throw new Error('Invalid major. Must be one of: CS, SE, IT, CE, DS');
        }
        return true;
    }
    
    validateGPA(gpa) {
        // ต้องเป็นตัวเลข และอยู่ระหว่าง 0.0 - 4.0
        // (เช็ค undefined เผื่อกรณีไม่ได้ส่งมา)
        if (gpa === undefined || gpa < 0 || gpa > 4.0) {
            throw new Error('GPA must be between 0.0 and 4.0');
        }
        return true;
    }
    
    validateStatus(status) {
        const validStatuses = ['active', 'graduated', 'suspended', 'withdrawn'];
        
        if (!status || !validStatuses.includes(status)) {
            throw new Error('Invalid status. Must be one of: active, graduated, suspended, withdrawn');
        }
        return true;
    }
    
    validateId(id) {
        const numId = parseInt(id);
        if (isNaN(numId) || numId <= 0) {
            throw new Error('Invalid student ID');
        }
        return numId;
    }
}

module.exports = new StudentValidator();