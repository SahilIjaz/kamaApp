const History=require('../models/historyModel');
const Booking=require('../models/bookingModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');

//creator
//already hitory creraed in bookingControllers
// exports.creator=catchAsync(async(req,res,next)=>{
//     req.body.creator=req.user._id;
//     next();
// });

// //historyCreration
// exports.createHistory=catchAsync(async(req,res,next)=>{


//     const booking=await Booking.findOne({
//         $and:
//         [
//             {creator:req.user._id},
//             {completedBooking:true}
//         ]
//     });

//     if(!booking)
//     {
//         return res.status(400).json(
//             {
//                 message:'Booking was not found!',
//                 reason:'Either id is in-correct or booking is not cmpleted'
//             }
//         );
//     }

//     const history=await History.create({history:booking._id});

// if(!history)
//         {
// return next(new appError('History was not created!',404));
// };

// res.status(200).json({
//     message:'History was cretaed !',
//     status:200,
//     History:{
//         history
//     }
// });
// });

//readHistory
exports.readHistory=catchAsync(async(req,res,next)=>{

    const history=await History.find({creator:req.user._id});

    if(history.length==0)
    {
        return res.status(400).json({
            message:'No history found!',
            reason:'Yo have not any history (completed bookings)'
        });
    };

res.status(200).json({
    message:'History found!',
    reason:'You have completed bookings',
    status:200,
    length:history.length,
    History:{
        history
    }
});
});

//updateHistory
exports.updateHistory=catchAsync(async(req,res,next)=>{

    const history=await History.findOne({
        $and:
        [
{_id:req.params.id},
{creator:req.user._id}
        ]
    });

    if(!history)
    {
        return next(new appError('History has not this data!',404));
    };

    history.history=req.body.history;
    await history.save();

res.status(200).json({
    message:'history has been update!',
    status:200,
    Hitory:
    [
        history
    ]
});
});

//deletHistory
exports.deletehistory=catchAsync(async(req,res,next)=>{


    const preHistory=await History.findOne({ 
        $and:
        [
              {_id:req.params.id},
              {creator:req.user._id}
        ]})

    const history=await History.findByIdAndDelete(req.params.id);

if(!history)
{
    return next(new appError('History was not deleted!',404));
};

res.status(201).json({
    message:'History delted successfully !',
    status:200,
    History:
    {
        history:null
    }
});
});

//deletCompleteHistory
exports.deletFullistory=catchAsync(async(req,res,next)=>{

    const history=await History.deleteMany({
        creator:req.user._id
    });

    if(!history)
    {
        return next(new appError('History not found and not deeted!',404));
    };

    res.status(200).json({
        message:'History has been deleted successfully!',
        status:200,
        History:
        [
            history
        ]
    });
});
