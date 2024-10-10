const dotenv = require("dotenv");
dotenv.config();

const Razorpay = require("razorpay");

exports.createRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
  });
};
