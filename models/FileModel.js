const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const fileSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    fileName: { type: String, required: true },
    tags: { type: [String], required: true },
    fileUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
