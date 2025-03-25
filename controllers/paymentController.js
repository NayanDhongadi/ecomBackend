const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: currency || "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify payment signature
exports.verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const response = await axios.get("https://api.razorpay.com/v1/payments", {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      },
    });

    const payments = response.data.items.map((payment) => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert to INR
      status:
        payment.status === "captured"
          ? "Success"
          : payment.status === "refunded"
          ? "Refunded"
          : "Failed",
      created_at: new Date(payment.created_at * 1000).toLocaleString(),
      customer: {
        name: payment.notes?.name || "N/A",
        email: payment.email || "N/A",
        contact: payment.contact || "N/A",
      },
      bank_rrn: payment.acquirer_data?.rrn || "N/A",
    }));

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Error fetching payments" });
  }
};

// Issue a refund
exports.issueRefund = async (req, res) => {
  const { payment_id } = req.body;

  try {
    const response = await axios.post(
      `https://api.razorpay.com/v1/payments/${payment_id}/refund`,
      {},
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    res.json({ success: true, refund_id: response.data.id, status: "Refunded" });
  } catch (error) {
    console.error("Refund Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Refund failed" });
  }
};
