const express = require('express');
const studentRoutes = require('./src/presentation/routes/studentRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json()); // อ่าน JSON body
app.use(express.static('public')); // (ถ้ามี frontend)

// Routes
// เชื่อมต่อ URL /api/students เข้ากับ Router ที่เราสร้างไว้
app.use('/api/students', studentRoutes);

// Error handling (ต้องอยู่ท้ายสุดเสมอ เพื่อดักจับ error จากทุก Route)
app.use(errorHandler);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Student Management System running on http://localhost:${PORT}`);
});