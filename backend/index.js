import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import handleBooking from "./controllers/handleBooking.js";
import verifyPayment from "./controllers/handleVerification.js";
import searchTurfRouter from "./routes/searchTurf.js";
import createUser from "./controllers/createUser.js";
import {handleSendFriendReq , handleListOfReq} from "./controllers/handleFriendReq.js";
dotenv.config();
const app = express();
const port = 3001;
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB database connected");
  } catch (err) {
    console.log("MongoDB database connection failed", err);
  }
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes

app.post("/pay/bookTurf", handleBooking);
app.use("/pay/verifyPayment", verifyPayment);
app.use("/search", searchTurfRouter);
app.use("/createUser", createUser);
app.use("/bookTurf", handleBooking);
app.use(
  "/send_friend_request",
  (req, res, next) => {
    console.log("📩 Sending friend request:", req.body);

    next();
  },
  handleSendFriendReq
);
app.use("/get_friend_requests", handleListOfReq);
// app.use("/friend_request_decision", handleFriendReq);
// Email sending endpoint
app.use("/sendConfirmationEmail", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Your booking is confirmed. Here are the details`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending confirmation email", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending confirmation email" });
    console.log(process.env.EMAIL_USER);
  }
});

// Start server
app.listen(port, () => {
  connect(); // Connect to the database when the server starts
  console.log("Server listening at port", port);
});
