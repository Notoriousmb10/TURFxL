import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

export const createRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
  });
};