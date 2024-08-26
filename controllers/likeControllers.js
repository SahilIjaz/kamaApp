const Like=require('../models/likeModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const handleFactory=require('../controllers/handlerFactory');
const User=require('../models/userModel');

//likeorDislikeSomeOne
exports.likeOrDislike=catchAsync(async(req,res,next)=>{
    let like;
console.log('11')
     like=await Like.findOne({
        $and:
        [
            {liked:req.params.id},
            { creator:req.user._id},
            {isLiked:true}
        ]
    });
    console.log('12')
    if(!like)
    {
like=await Like.create({
    liked:req.params.id,
    creator:req.user._id
});
        console.log('13')
like.isLiked=true;
await like.save();
console.log('14')
const pliked=await User.findById(req.params.id);
        return res.status(200).json({
            message:`${pliked.role} has been liked.`,
            status:200,
            Like:{
                like
            }
        });
    }
    else
    {
        console.log('15')
        like.isLiked=false;
        await like.save();
        console.log('16')
        return res.status(201).json({
            message:'Your like has been removed!',
            status:201,
            Like:{
                like
            }
        });
    };
});

//allLikes
exports.Favourities=catchAsync(async(req,res,next)=>{

const like=await Like.find({
    $and:
    [
        {creator:req.user._id},
        {isLiked:true}
    ]
});

if(like.length<1)
{
return res.status(400).json({
    message:'You have no favourities.',
    reason:'You have-not liked ny one.',
    status:400
});
};

res.status(200).json({
    message:'Your favourities found!',
    reason:'You liked some-one',
    statu:200,
    length:like.length,
Like:{
    like
}
});
});



//updateLike
exports.updateLike=handleFactory.updateOne(Like);

//deleteLike
exports.deleteLike=handleFactory.deleteOne(Like);