const FeedBack=require('../models/feedBackModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const handlerFactory=require('./handlerFactory');

//creator
// exports.creator=catchAsync(async(req,res,next)=>{
//     req.body.creator=req.user._id;
//     next();
// });

//giveFeedback
exports.createFeedBack=catchAsync(async(req,res,next)=>{

    const feedBack=await FeedBack.create({
        feedBack:req.body.feedBack
    });

    if(!feedBack)
    {
        return next(new appError('FEed-Back not created!',404));
    };

    feedBack.creator=req.user._id;
    await feedBack.save();
    
res.status(200).json({
        message:'feedback created!',
        status:200,
        FeedBack:
        {
            feedBack
        }
    });
});


//readOwnFeedBakc
exports.getOwnFeedBAck=catchAsync(async(req,res,next)=>{
    const feedback=await FeedBack.find({
        creator:req.user._id
    });

    if(feedback.length<1)
    {
        return res.status(400).json({
            message:'Fedback was not found!',
            reason:'Feedback was not given by your side.',
            status:400
        });
    };

res.statu(200).json({
    message:'FeedBacks found !',
    status:200,
    length:feedback.length,
    FeedBack:{
        feedback
    }
});
});

//getAllFeedBacks
exports.getAllFeedBAck=catchAsync(async(req,res,next)=>{

    const feedBack=await FeedBack.find();

    if(feedBack.length<1)
    {
        return res.status(400).json({
            message:"Feedback not found!",
            reason:"Not created by any-one",
            status:400
        });
    };

    res.status(200).json({
        message:'All feedBAcks found!',
        status:200,
        FeedBAck:
        {feedBack}
    });
});


//updatefeedback
exports.updateFeedBAck=handlerFactory.updateOne(FeedBack);

//deletFeedback
exports.deletFeedBack=handlerFactory.deleteOne(FeedBack);

//deletallFeedBAcks
exports.deletAllFeedBAcks=catchAsync(async(req,res,next)=>{

    const feedBack=await FeedBack.deleteAll();

    if(!feedBack)
    {return next(new appError('Feedbacks were not delted!',404));};

    res.status(201).json({
        message:'Feedback delted successfully!',
        status:201,
        Feedbacks:{
            feedBack:null
        }
    });
});
