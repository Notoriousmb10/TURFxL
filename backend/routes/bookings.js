import express from 'express'
import { createBooking, getBooking } from '../controllers/bookingController.js'
import { verifyUser,verifyAdmin} from  '../utils/verifyToken.js'


const router = express.Router()




router.post('/',verifyUser,createBooking);
router.get('/:id', verifyUser,getBooking);
router.get('/', verifyAdmin,getBooking);
export default router
