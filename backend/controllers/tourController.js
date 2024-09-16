import Tour from '../models/Tour.js';

// Create a new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update a tour
export const updateTour = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedTour,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update"
        });
    }
};

// Delete a tour
export const deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        await Tour.findByIdAndDelete(id);
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

// Get a single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findById(id);
        res.status(200).json({
            success: true,
            data: tour
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to get the tour"
        });
    }
};

// Get all tours
export const getAllTour = async (req, res) => {

    const page = parseInt(req.query.page)-1;
     console.log(page);
    try {
        const tours = await Tour.find({}).populate('reviews').skip(page * 8).limit(8);

        res.status(200).json({
            success: true,
            count:tours.length,
            data: tours
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to get tours"
        });
    }
};

export const getTourBySearch = async (req, res) => {
    console.log(req.query); // Log query params
    const city = new RegExp(req.query.city, 'i');
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        const tours = await Tour.find({
            city,
            distance: { $gte: distance },
            maxGroupSize: { $gte: maxGroupSize }
        }).populate("reviews");

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to get tours"
        });
    }
};





// Get featured tours
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).skip(page * 8).limit(8);
        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (err) {
        console.error('Error fetching featured tours:', err); // Log the actual error
        res.status(500).json({
            success: false,
            message: "Failed to get tours"
        });
    }
};



//get tour counts

export const getTourCount = async(req,res)=>{
    try{
        const tourCount = await Tour.estimatedDocumentCount()
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to get "
        });

    }
}