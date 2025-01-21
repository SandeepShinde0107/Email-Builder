const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const emailController = require('../controllers/emailController');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter to allow only specific image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
};

// Multer upload instance
const upload = multer({ storage, fileFilter });

// Error handling middleware for Multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    next(); // Pass the request to the next handler if no error
};

// Image upload route with error handling
router.post('/uploadImage', upload.single('image'), handleMulterError, emailController.uploadImage);

// Route to get email layout
router.get('/getEmailLayout', emailController.getEmailLayout);
router.post('/uploadEmailConfig', emailController.uploadEmailConfig);
router.post('/renderAndDownloadTemplate', emailController.renderAndDownloadTemplate);


module.exports = router;
