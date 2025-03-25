const express = require("express");
const { sendFileToClient } = require("../controllers/clientController");

const router = express.Router();

// 📌 Client Route to Request File via Email
router.post("/send-file", sendFileToClient);

module.exports = router;

