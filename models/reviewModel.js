const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review must be provided']
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    ratings:{
        type:Number,
        min:1 ['Greatar than 0 '],
        max:5 ['Below or equla to 5 '],
        required:[true,'Ratingd are compulsory.']
    },
  totalRating:{
    type:Number   
  }  
},{timestamps:true});


//;;;;;;;;;population

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'creator',
        select:'name email image gender'
    })
    this.populate({
        path:'reciever',
        select:'name email image gender'
    });
    next();
});



const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;






