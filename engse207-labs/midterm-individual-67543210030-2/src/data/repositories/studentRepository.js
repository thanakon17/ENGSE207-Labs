const db = require('../database/connection');

class StudentRepository {
    
    // Implement findAll
    async findAll(filters = {}) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM students';
            let params = [];
            let conditions = [];
            
            // ตรวจสอบ filters ที่ส่งเข้ามา
            if (filters.major) {
                conditions.push('major = ?');
                params.push(filters.major);
            }
            
            if (filters.status) {
                conditions.push('status = ?');
                params.push(filters.status);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Implement findById
    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Implement create
    async create(studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;
        
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO students (student_code, first_name, last_name, email, major) VALUES (?, ?, ?, ?, ?)';
            
            db.run(sql, [student_code, first_name, last_name, email, major], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return the created student โดยใช้ this.lastID
                    db.get('SELECT * FROM students WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // ✅ Implement update (ส่วนที่เติมเพิ่ม)
    async update(id, studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE students SET student_code = ?, first_name = ?, last_name = ?, email = ?, major = ? WHERE id = ?';
            const params = [student_code, first_name, last_name, email, major, id];

            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    // เมื่อ update เสร็จ ให้ดึงข้อมูลล่าสุดกลับไปแสดงผล
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // Implement updateGPA
    async updateGPA(id, gpa) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE students SET gpa = ? WHERE id = ?', 
                [gpa, id], 
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    }
                }
            );
        });
    }

    // Implement updateStatus
    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE students SET status = ? WHERE id = ?', 
                [status, id], 
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    }
                }
            );
        });
    }

    // Implement delete
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ message: 'Student deleted successfully' });
            });
        });
    }
}

module.exports = new StudentRepository();