import { createRazorpayInstance } from "../config/razorpay.config.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Import NodeMailer

dotenv.config();
const razorpayInstance = createRazorpayInstance();

// Function to send confirmation email
const sendConfirmationEmail = async (email, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Dear User,\n\nYour booking has been confirmed. Here are the details:\n\nTurf Name: ${bookingDetails.name}\nCity: ${bookingDetails.city}\nDate: ${bookingDetails.date}\nTime Slot: ${bookingDetails.slot}\nTurf: ${bookingDetails.turf}\nPrice Paid: ₹${bookingDetails.price}\n\nThank you for booking with us!\n\nBest regards,\nTurfxL Team`,
  };

  await transporter.sendMail(mailOptions);
};

// Create order function
const handleBooking = async (req, res) => {
  const turfData = req.body;
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
        const bookingDetails = {
          name: turfData.name,
          city: turfData.city,
          date: turfData.date,
          slot: turfData.slot,
          turf: turfData.turf,
          price: turfData.amount,
        };

        // Send confirmation email
        try {
          await sendConfirmationEmail(turfData.email, bookingDetails);
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }

        return res.status(200).json({
          success: true,
          orderId: order.id,
          key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
          bookingDetails,
        });
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
