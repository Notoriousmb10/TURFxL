import User from '../models/User.js';  // Correct the import path

// Create a new user
export const createUser = async (req, res) => {
    const newUser = new User(req.body);  // Fixed typo and incorrect usage

    try {
        const savedUser = await newUser.save();  // Save the new user correctly
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedUser  // Return the saved user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });  // Correctly update the user and return the new document
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser,  // Return the updated user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update"
        });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {  // Fixed typo in function name
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);  // Correctly reference User model
        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete"
        });
    }
};

// Get a single user
export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);  // Correctly reference User model
        res.status(200).json({
            success: true,
            data: user  // Return the found user
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to get the user"
        });
    }
};

// Get all users with pagination
export const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 0;  // Handle pagination

    try {
        const users = await User.find({})  // Correctly reference User model
            .skip(page * 8)
            .limit(8);
        res.status(200).json({
            success: true,
            data: users,  // Return the paginated users
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to get users"
        });
    }
};
