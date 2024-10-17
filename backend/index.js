import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tourRoute from './routes/tours.js'; 
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js' 
import handleBooking from './controllers/handleBooking.js'
import handleVerification from './controllers/handleVerification.js'
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
app.use('/api/v1/booking',bookingRoute)
app.use('/pay/bookTurf', handleBooking)
app.use('/pay/verifyPayment', handleVerification)


// Start server
app.listen(port, () => {
    connect();  // Connect to the database when the server starts
    console.log('Server listening at port', port);
});
