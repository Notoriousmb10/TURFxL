import express from 'express';
import { createTour,getTourCount, deleteTour,getFeaturedTour, getAllTour, getSingleTour, updateTour,getTourBySearch } from '../controllers/tourController.js';
import { verifyAdmin,verifyUser } from '../utils/verifyToken.js';
const router = express.Router();

// Route to create a new tour
router.post('/',verifyAdmin, createTour);

// Route to update an existing tour
router.put('/:id',verifyAdmin, updateTour);

// Route to delete a tour
router.delete('/:id',verifyAdmin, deleteTour);  // Corrected the route to include :id

// Route to get a single tour
router.get('/:id', getSingleTour);

// Route to get all tours
router.get('/', getAllTour);

//get tour by search
router.get("/search/getTourBySearch", getTourBySearch);

router.get("/search/getFeaturedTours", getFeaturedTour);

router.get('/search/getTourCount', getTourCount)



export default router;
