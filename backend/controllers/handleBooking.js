import { createRazorpayInstance } from "../config/razorpay.config";
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const razorpayInstance = createRazorpayInstance();

// Create order function
const handleBooking = async (req, res) => {
    const { amount } = req.body; 
    const options = {
        amount: amount * 100, 
        currency: 'INR',
        receipt: 'receipt_order_1',
    };

    try {
        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong',
                });
            }
            return res.status(200).json({
                success: true,
                orderId: order.id,
                key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

export default handleBooking;