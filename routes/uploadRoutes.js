const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
