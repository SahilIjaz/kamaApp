// const MeetingLocation=require('../models/meetingLocationModel');
// const User=require('../models/userModel');
// const catchAsync=require('../utils/caychAsync');
// const appError=require('../utils/appError');

// //creator
// // exports.creator=catchAsync(async(req,res,next)=>{
// //     req.body.creator=req.user._id;
// //     next();
// // });

// //createMeetingLocation
// exports.createLoaction=catchAsync(async(req,res,next)=>{
//     console.log('1')
//     const user=await User.findById(req.user._id);
//     console.log('2')
// const meetingLocation=await MeetingLocation.create({
//     location:req.body.location,
//     creator:req.user._id,
// });

// if(!meetingLocation)
// {return res.status(400).json({
//     message:'Meeting location was not fixed!',
//     status:400
// });
// };
// console.log('3')

// meetingLocation.meetingPerson=req.params.id;
// user.meetingLocation=meetingLocation;
// await user.save();
// await meetingLocation.save();

// res.status(200).json({
//     message:'Meeting location has been specified!',
//     status:200,
//     Location:{
//         meetingLocation
//     }
// });
// });


// //readmeetingLocation
// exports.readMyMeetingLocation=catchAsync(async(req,res,next)=>{

//     const location=await MeetingLocation.find({
//         $or:[{creator:req.user._id},{meetingPerson:req.user._id}]
//     });

//     if(location.length<1)
//     {
// return res.status(400).json({
//     message:'Meeting location was not found',
//     reason:'You have not meeting location registered!',
//     status:400
// });
// };

// return res.status(200).json({
//     message:'Your meeting locations found!',
//     status:200,
//     MeetingLocations:[
//         location
//     ]
// });
// });

// //updateMeetinglocation
// exports.updateMeetingLocation=catchAsync(async(req,res,next)=>{
//    console.log('start')
// const pmeeting=await MeetingLocation.findById(req.params.id);


// console.log(pmeeting)
// console.log('mid')
// if(pmeeting.length===0)
// {return next(new appError('You have no location created yet !',400));};
// console.log('proceeding forward')

// const user=await User.findById(req.user._id);
// console.log('near to end')

    
//     pmeeting.location=req.body.location;
//     pmeeting.updatedBy=req.user._id;
//     pmeeting.updated=true;
//     await pmeeting.save();
//     console.log('ending')

//     user.meetingLocation=pmeeting;
//     await user.save();
// console.log('ended')
//     res.status(200).json({
//         message:'Meeting ocation has been updated!',
//         status:200,
//         Meeting_Locatins:{
//             location
//         }
//     });
// });

// //cancelLocation
// exports.deleteMeetingLocation=catchAsync(async(req,res,next)=>{
//     let location;

//     location=await MeetingLocation.find({
//         _id:req.params.id,
//         creator:req.user._id
//     });

//     if(!location)
//     {
//         return next(new appError('Location do-not exist!'));
// };

//     const user=await User.findById(req.user._id);

// if(!user)
//     {return next(new appError('User not-found !',404));
// };

// const pmeeting=await User.findById(location.meetingPerson.id);

// if(!pmeeting)
// {return next(new appError('Meeting person not found !',404));};

//     location=await MeetingLocation.findByIdAndDelete(req.params.id,);

// if(!location)
//     {return res.status(400).json({
//         message:'location was not deleted!',
//         status:400
//     });
// };

// user.meetingLocation=null;
// pmeeting.meetingLocation=null;
// await user.save();
// await pmeeting.save();

// res.status(200).json({
//     message:'Location has been delted!',
//     statu:200,
//     Location:{
//         location:null
//     }
// });
// });