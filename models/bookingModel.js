const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    time:{
        type:String,
        required:[true,'Time is compulsory.']
    },
    day:{
        type:String,
        enum:['Monday','Tuesday','Thursday','Friday','Saturday','Sunday']
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    booked:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    meetingLocation:{
        type:String,
        enum:[`home visit`,`visit to clients home`,`hotel`,`provider's office`]
    },
    status:{
        type:String,
        enum:['accepted','cancelled','rejected','pending','completed'],
        default:'pending'
    },
    completedBooking:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});


bookingSchema.pre(/^find/,function(next){
this.populate({
    path:'creator',
    select:'name email gender location'})
this.populate({
    path:'booked',
    select:'name email gender location'
})
next()
});

const Booking=mongoose.model('Booking',bookingSchema);
module.exports=Booking;

