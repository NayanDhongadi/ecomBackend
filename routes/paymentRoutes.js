const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Define payment routes
router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);
router.get("/get-payments", paymentController.getPayments);
router.post("/issue-refund", paymentController.issueRefund);

module.exports = router;
