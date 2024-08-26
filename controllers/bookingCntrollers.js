const Booking=require('../models/bookingModel');
const MeetingLocation=require('../models/meetingLocationModel');
const User=require('../models/userModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const handlerFactory=require('../controllers/handlerFactory');
const History=require('../models/historyModel');
const { creator } = require('./blockControllers');
const { ObjectId } = require('mongodb');

//makeBoking
exports.createBooking=catchAsync(async(req,res,next)=>{
    console.log('booking api hit')

const booking=await Booking.create({
    time:req.body.time,
    day:req.body.day,
    booked:req.body.booked,
    meetingLocation:req.body.meetingLocation
});

console.log('hit 3')
if(!booking)
{return next(new appError('Booking was not created!',404));};

booking.creator=req.user._id;
await booking.save();

console.log('hit 4')
res.status(200).json({
    message:'Booking created successfully!',
    status:200,
    BookingIS:[
        booking
    ]
});
});


//readBooking
exports.getBookings=catchAsync(async(req,res,next)=>{

    if(req.user.role==='user')
    {

    const booking=await Booking.find({
        creator:req.user._id,
    status:req.query.status
    });


    if(booking.length===0)
    {
        return res.status(400).json({
            message:'bookings do-not exist!',
            status:400
        });
    };

    res.status(200).json({
        message:`${req.query.status} bookings found !`,
        status:200,
        length:booking.length,
        Bookings:{
            booking
        }
    });
}
else if(req.user.role==='professional')
{
    const booking=await Booking.find({
        booked:req.user._id,
    status:req.query.status
    });


    if(booking.length<1)
    {
        return res.status(400).json({
            message:'bookings do-not exist!',
            status:400
        });
    };

    res.status(200).json({
        message:`${req.query.status} bookings found !`,
        status:200,
        length:booking.length,
        Bookings:{
            booking
        }
    });
}
});


//updateBoooking
exports.updateBooking=catchAsync(async(req,res,next)=>{

    const preBooking=await Booking.findOne({
        creator:req.user._id
    });

if(!preBooking)
{return next(new appError('This booking do-not exists!',404));
};

    const booking=await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        });

if(!booking)
{
return next(new appError('Booking was not updated!',404));
};
    
res.status(200).json({
    message:'Booking has been updated!',
    status:200,
    length:booking.length,
    Bookings:{
        booking
    }
});
});


//delteBooking
exports.deleteBooking=catchAsync(async(req,res,next)=>{

    const booking =await Booking.findByIdAndDelete(req.params.id);
console.log('BOOKING I S: ',booking);
    
// await MeetingLocation.findByIdAndDelete(booking.meetingLocation._id);

    if(!booking)
    {
        return res.status(404).json({
message:'Booking was not deleted !',
status:404,
reasons:[
    "You have not made this booking ",
    "Booking ID is incorrect",
    "Boking status is not cancelled"
]
        });
};

res.status(200).json({
    nmessage:'Booking has been deetd!',
    status:200,
    Bookig:{
        booking
    }
});
});

//getOneBooking
exports.getOneBooking=handlerFactory.getOne(Booking);

//cancelOrAccepptBooking
exports.cancelOrAcceptBooking=catchAsync(async(req,res,next)=>{

let booking;

    if(req.user.role==='professional')
    {

    booking=await Booking.findById(req.params.id);

        if(!booking)
        {return next(new appError('Booking do-not exists!',404));
};

if(req.body.status==='rejected')
{
    booking.status='cancelled';
    await booking.save(); 
}
else
{
    booking.status=req.body.status;
    await booking.save();
}

res.status(200).json({
    message:`Booking has successfuly ${req.body.status}.`,
    status:200,
    Booking:{
        booking
    }
});
}
    else if(req.user.role==='user')
    {
        booking=await Booking.findById(req.params.id);

if(!booking)
        {return next(new appError('Booking do-not exists!',404));
};

        if(req.body.status==='accepted'||req.body.status==='rejected')
        {
return res.status(400).json({
message:'You can-not perform this action.',
reason:`You are ${req.user.role}.`,
status:400
    });
};

    booking.status===req.body.satus;
    await booking.save();

res.status(200).json({
        message:`Booking ${req.body.status}.`,
        status:200,
        Booking:{
            booking
        }
    });
    }
    else if(req.user.role==='admin')
    {
        return res.status(500).json({
            message:'You can-not perform this action!',
            reason:`You are ${req.user.role}.`,
            status:500
        });
    }
});


//completeBooking
exports.completeBooking=catchAsync(async(req,res,next)=>{
    const booking=await Booking.findOne({
        $and:
        [
            {_id:req.params.id},
       { $or:
        [
            {creator:req.user._id},
            {boooked:req.user._id}
        ]
       },
          {status:'accepted'}
        ]
    });
    console.log('BOOKING IS : ',booking);


    if(!booking)
    {return next(new appError('No accepted booking found to be shown as completed!',404));};
booking.status='completed';
    booking.completedBooking=true;

    await booking.save();

    const history=await History.create({
        creator:req.user._id,
    });

    if(!history)
{return next(new appError('History not create!',404));};

    history.history=booking;
    await history.save();

res.status(200).json({
    message:'Booking marked as completed!',
    status:200,
    Booking:
    {
        booking
    }
});   
});