 import Booking from '../models/Booking.js'
 
 //create 
 export const createBooking = async(req,res)=>{
    const newBooking = new Booking(req.body)
    try{
        const savedBooking = new Booking(req.body)
        res.status(200).json({success:true,message:'Your tour is Booked',
            data:savedBooking}
        )
    }
    catch(err){

        res.status(500).json({success:false,message:'Server error'}
        )
    }
 };

 export const getBooking = async(req,res)=>{
    const id = req.params.id
    try{
        const book = await Booking.findById(id)
        res.status(200).json({success:true,message:'Your tour is Booked',
            data:book,})


    }catch(err){

        res.status(404).json({success:false,message:'not found'})
    }
 }



 export const getAllBooking = async(req,res)=>{

    try{
        const books = await Booking.findById(id)
        res.status(200).json({success:true,message:'Your tour is Booked',
            data:books,})


    }catch(err){

        res.status(500).json({success:false,message:'Server error'})
    }
 }