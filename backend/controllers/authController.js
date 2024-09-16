import User from '../models/User.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            username: req.body.username, // Fixed typo: req.boy.username -> req.body.username
            email: req.body.email,
            password: hashedPassword, // Save the hashed password
            photo: req.body.photo
        });

        // Save the user in the database
        await newUser.save();

        res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Not created', error: err.message });
    }
};
export const login = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user){return res.status(404).json({ success: false, message: 'User not found' })};

        // Compare the password with the stored hashed password
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const {  password, role, ...rest } = user._doc;

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15d',
        });

        // Set token in browser cookies and send the response to client
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires:  token.expiresIn // 15 days
        }).status(200).json({
            success:true, message:'successfully login',

        
            data: { ...rest },
           
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to log in', error: err.message });
    }
};
// export const logout = (req, res) => {
//     res.clearCookie('accessToken').status(200).json({ success: true, message: 'Logged out' });
// };
 
// //  In the  login  function, I have added the following code to create a JWT token and set it in the browser cookies. 
//  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
//     expiresIn: '15d',
// });