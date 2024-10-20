import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import tourRoute from './routes/tours.js'; 
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import reviewRoute from './routes/reviews.js';
import bookingRoute from './routes/bookings.js';
import handleBooking from './controllers/handleBooking.js';
import verifyPayment from './controllers/handleVerification.js';

dotenv.config();
const app = express();
const port = 3001;
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};

// Database connection
mongoose.set('strictQuery', false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB database connected');
    } catch (err) {
        console.log('MongoDB database connection failed', err);
    }
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tours', tourRoute); 
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.post('/pay/bookTurf', handleBooking);
app.post('/pay/verifyPayment', verifyPayment);

// Email sending endpoint
app.post('/sendConfirmationEmail', async (req, res) => {
    const { email, bookingDetails } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking Confirmation',
        text: `Your booking is confirmed. Here are the details:\n\n${JSON.stringify(bookingDetails, null, 2)}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Confirmation email sent successfully' });
    } catch (error) {
        console.error('Error sending confirmation email', error);
        res.status(500).json({ success: false, message: 'Error sending confirmation email' });
    }
});

// Start server
app.listen(port, () => {
    connect();  // Connect to the database when the server starts
    console.log('Server listening at port', port);
});