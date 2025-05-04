const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 Replace with your Razorpay key_id and key_secret
const razorpay = new Razorpay({
    key_id: 'rzp_test_MzAJ6My63y0Lhy',
    key_secret: 'XsNZS5aRue3ulpU71npJd4pb'
});

// ✅ Create an order
app.post("/create-order", async (req, res) => {
    const options = {
        amount: 100, // amount in smallest currency unit (100 paise = ₹1.00)
        currency: "INR",
        receipt: "asdfdsf", // can be any string
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ order_id: order.id });
    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
});

// ✅ Verify payment signature
app.post("/verify-payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", "YOUR_SECRET_KEY");
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
