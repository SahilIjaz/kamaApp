// const mongoose=require('mongoose')

// const meetingLocationSchema=new mongoose.Schema({
//     location:{
      
//     },
//     creator:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     meetingPerson:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     updatedBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     updated:{
//         type:Boolean,
//         default:false
//     }
// },
// {
//     timestamps:true
// });

// // meetingLocationSchema.pre(/^find/,function(next){
// //     console.log("POPULATING MEETING LOCATION MODEL")
// //     this.populate({
// // path:'creator',
// // select:'name email gender location'
// //     })
// //     this.populate({
// //         path:'meetingPerson',
// //         select:'name email gender location'
// //             })
// //             this.populate({
// //                 path:'updatedBy',
// //                 select:'name email gender location'
// //                     })

// //                     next()
// // });


// const MeetingLocation=mongoose.model('MeetingLocation',meetingLocationSchema);
// module.exports=MeetingLocation;