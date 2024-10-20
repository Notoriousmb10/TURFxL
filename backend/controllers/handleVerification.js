import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Verify payment function
const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const secret = process.env.REACT_APP_RAZORPAY_KEY_SECRET;

    // Validate if all necessary data is received
    if (!order_id || !payment_id || !signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment verification data",
        });
    }

    // Create Hmac object for signature verification
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");

    // Compare signatures
    if (generatedSignature === signature) {
        return res.status(200).json({
            success: true,
            message: "Payment verified",
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};

export default verifyPayment;