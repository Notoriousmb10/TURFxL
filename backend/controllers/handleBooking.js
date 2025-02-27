import { createRazorpayInstance } from "../config/razorpay.config.js";

import dotenv from "dotenv";

dotenv.config();
const razorpayInstance = createRazorpayInstance();

// Create order function
const handleBooking = async (req, res) => {
  const { turfData } = req.body;
  const options = {
    amount: turfData.amount * 100,
    currency: "INR",
    receipt: "receipt_order_1",
  };

  try {
    razorpayInstance.orders.create(options, async (err, order) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      } else {
        const success = res.status(200).json({
          success: true,
          orderId: order.id,
          key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
        });

        const resp = await axios.post(
          "http://localhost:5000/handle_booking",
          turfData
        );


        return success;
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default handleBooking;
