const File = require("../models/FileModel");
const transporter = require("../config/emailConfig");

// 📌 Send File Link to Client via Email
exports.sendFileToClient = async (req, res) => {
    try {
        const { email, fileId } = req.body;

        if (!email || !fileId) {
            return res.status(400).json({ error: "Email and file ID are required" });
        }

        // ✅ Find File in Database
        const fileData = await File.findById(fileId);
        if (!fileData) {
            return res.status(404).json({ error: "File not found" });
        }

        // ✅ Send Email with Download Link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your File Download Link",
            html: `<p>Hello,</p>
                   <p>Your requested file <b>${fileData.fileName}</b> is ready for download:</p>
                   <p><a href="${fileData.fileUrl}" target="_blank">Download File</a></p>
                   <p>Thank you!</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);

        res.json({ message: "File sent successfully to email", fileUrl: fileData.fileUrl });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to send file", details: error.message });
    }
};
