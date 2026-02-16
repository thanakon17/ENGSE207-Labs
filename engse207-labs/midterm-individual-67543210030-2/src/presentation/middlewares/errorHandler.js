function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    let statusCode = 500;
    let errorMessage = err.message || 'Internal server error';

    // Handle different error types based on error message content
    // เนื่องจากเรา throw Error('message') มาจาก Service layer เราจึงเช็คจากข้อความ
    
    // 1. NotFoundError -> 404
    if (err.message.includes('not found')) {
        statusCode = 404;
    } 
    // 2. ValidationError -> 400 (เช็คคำว่า Invalid หรือ required หรือ Cannot change)
    else if (
        err.message.includes('Invalid') || 
        err.message.includes('required') || 
        err.message.includes('Cannot change') ||
        err.message.includes('Cannot delete') ||
        err.message.includes('must be')
    ) {
        statusCode = 400;
    }
    // 3. ConflictError -> 409 (ข้อมูลซ้ำ)
    else if (
        err.message.includes('exists') || 
        err.message.includes('UNIQUE')
    ) {
        statusCode = 409;
        errorMessage = 'Student code or email already exists';
    }

    res.status(statusCode).json({
        error: errorMessage
    });
}

module.exports = errorHandler;
