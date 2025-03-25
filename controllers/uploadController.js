const fs = require('fs');
const path = require('path');
const { b2, authorize } = require('../config/b2Config');
const File = require('../models/FileModel.js');

exports.uploadFile = async (req, res) => {
    try {
        // ✅ Authorize Backblaze
        await authorize();

        const filePath = req.file.path;
        const fileName = req.file.filename;
        const tags = req.body.tags ? req.body.tags.split(',') : [];

        // ✅ Read File
        const fileBuffer = fs.readFileSync(filePath);

        // ✅ Step 1: Get Upload URL from Backblaze
        const uploadUrlResponse = await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID
        });

        const uploadUrl = uploadUrlResponse.data.uploadUrl;
        const authToken = uploadUrlResponse.data.authorizationToken;

        // ✅ Step 2: Upload the File to Backblaze
        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl,
            uploadAuthToken: authToken,
            fileName: fileName,
            data: fileBuffer
        });

        // ✅ Step 3: Construct File URL manually
        const fileUrl = `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

        // ✅ Step 4: Save File Data in MongoDB
        const fileData = new File({
            fileName: req.file.originalname,
            tags: tags,
            fileUrl: fileUrl
        });

        await fileData.save();

        // ✅ Step 5: Delete File from Local Storage
        fs.unlinkSync(filePath);

        // ✅ Step 6: Send Response
        res.status(201).json({
            message: 'File uploaded successfully',
            data: fileData
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            error: 'Failed to upload file',
            details: error.message
        });
    }
};
