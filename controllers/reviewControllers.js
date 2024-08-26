const Review=require('../models/reviewModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const User=require('../models/userModel');
const mongoose=require('mongoose');

//creator
// exports.setCreator = catchAsync(async (req, res, next) => {
//     req.body.creator = req.user.id;
//     next();
// });

//createreview
exports.createReview=catchAsync(async(req,res,next)=>{
const review=await Review.create({
    review:req.body.review,
    reciever:req.params.id,
    ratings:req.body.ratings,
    creator:req.user._id,
});

if(!review)
{return next(new appError('Review was not created!',404))};

const user=await User.findById(review.reciever);

if(!user)
{return next(new appError('Receiver not found!'));};

console.log('USER IS : ',user);

const reviews = await Review.find({ reciever: review.reciever });
const totalRating = reviews.reduce((sum, rev) => sum + rev.ratings, 0);
const averageRating = totalRating / reviews.length;

reviews.forEach(async (rev) => {
    rev.totalRating = averageRating.toFixed(2);
    await rev.save();
});

user.rating=averageRating.toFixed(2);
await user.save();

review.totalRating=averageRating.toFixed(2);
await review.save();

res.status(200).json({
    message:'Review cereated successfully !',
    status:200,
    averageRatings:averageRating.toFixed(2),
    review
});
});


//redReview
exports.readOneReview=catchAsync(async(req,res,next)=>{

    const review=await Review.findById(req.params.id);

    if(!review)
    {return next(new appError('Review not found!'))};

    res.status(200).json({
        message:'REview found successfully!',
        status:200,
        review
    });
});

//getAllReviewsOfAnotherPerson
exports.getOthersReviews=catchAsync(async(req,res,next)=>{

const userId=req.params._id;
console.log('uSER IS : ',userId);

    const review=await Review.find({receiver:req.params._id});

    console.log('Reviews found:', review);

if(review.length===0)
{return res.status(400).json({
message:'Review not found !',
reason:'No reviews for this person!',
status:400
});
};

const avgReview=await Review.findOne({
    $or:
    [
        {creator:req.user._id},
        {reciever:req.user._id}
    ]
});

const averageRating=avgReview.totalRating;

res.status(200).json({
    message:'Reviews found successfully !',
    status:200,
    length:review.length,
    averageRatings:averageRating,
    Reviews:{
        review
    }
});
});


//getAllReviewsAboutYourSelf
exports.getOwnReviews=catchAsync(async(req,res,next)=>{

const review=await Review.find({
    $or:
    [
        {creator:req.user._id},
        {reciever:req.user._id}
    ]
});

if(review.length===0)
{return res.status(404).json({
    message:'Reviews not found!',
    reason:'You not cretaed or received any review',
    status:404
});
};


const avgReview=await Review.findOne({
    $or:
    [
        {creator:req.user._id},
        {reciever:req.user._id}
    ]
});

const averageRating=avgReview.totalRating;

res.status(200).json({
    message:'Reviews found successfully !',
    status:200,
    length:review.length,
    averageRatigs:averageRating,
    Reviews:{
        review
    }
});
});

//updateYourOwnReview
exports.updateReview=catchAsync(async(req,res,next)=>{

    const review=await Review.findOne({
        _id:req.params.id,
        creator:req.user._id
    });

    review.review=req.body.review;
    review.ratings=req.body.ratings;

    const user=await User.findOne({_id:review.reciever});

    if(!user)
    {return next(new appError("USer not found !",404));};

    const reviews = await Review.find({ reciever: review.reciever });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.ratings, 0);
    const averageRating = totalRating / reviews.length;
    
    reviews.forEach(async (rev) => {
        rev.totalRating = averageRating.toFixed(2);
        await rev.save();
    });
    
    user.rating=averageRating.toFixed(2);
    await user.save();

    review.totalRating=averageRating.toFixed(2);
await review.save();

    console.log(user);

res.status(200).json({
    message:'Review has been updated!',
    status:200,
    updatedReview:{
        review
    }
});
});


//deleteReview
exports.deleteReview=catchAsync(async(req,res,next)=>{

    const review=await Review.findOneAndDelete({
        _id:req.params.id,
        $or:
        [
            {creator:req.user._id},
            {reciever:req.user._id}
        ]
    });

    if(!review)
    {return next(new appError('Review not deleted!',404));};

    res.status(201).json({
        message:'review has been deleted successfully !',
        status:201,
        data:null
    });
});

//deleetAllReviews
exports.deleteAllReviews=catchAsync(async(req,res,next)=>{

const review = await Review.deleteMany({
    $or: 
    [
        { creator: req.user._id },
        { receiver: req.user._id }
    ]
});

console.log('USer is: ',req.user._id);

    if(!review)
    {return res.status(404).json({
        message:'Reviews can-not be deleted!',
        reason:"reviews not-found.",
        issue:'You have not created any review',
        status:404
    });};

    res.status(201).json({
        message:'REviews deleted successfully',
        status:201,
        Deleted:true,
        Data:null
    });
});