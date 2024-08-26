const Block=require('../models/blockModel');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');
const Booking = require('../models/bookingModel');
const handlerFactory=require('./handlerFactory');


exports.creator=catchAsync(async(req,res,next)=>{
    res.body.creator=req.user._id;
    next();
});

//blockSOmeOne
exports.block=catchAsync(async(req,res,next)=>{

    if(req.user.role===req.body.blocked.role)
    {
        return res.status(450).json({
            message:'Same roles can-not block each-other!',
            reason:'same roles detected over here.',
            status:450,
        });
    };

    const preBlock=await Block.findOne({
        $and:
        [
            {creator:req.user._id},
            {blocked:req.body.blocked}
        ]
    });
console.log('PRE_BLOCK : ',preBlock);
console.log('PRE_BLOCK BODY : ',req.body.blocked);
    if(!preBlock)
    {
        const block=await Block.create({
            blocked:req.params.id
        });

        if(!block)
        {return res.status(400).json({
            message:'User was noy bocked!',
            status:400,
        });
    };

block.creator=req.user._id;
await block.save();

    res.status(200).json({
        message:'User has been blocked successfully!',
        status:200,
User:{
    block
} 
});
}
else
{
res.status(200).json({
    message:'This person is already blocked!',
    statsu:200,
})
}
});

//unBlock
exports.unBlock=catchAsync(async(req,res,next)=>{


const delBlock=await Block.findByIdAndDelete(req.params.id);

console.log('BLOCK IS : ',delBlock);
if(!delBlock)
    {
        return next(new appError('User was not found!',404));
};

res.status(201).json({
    message:'User has been un-blocked!',
    status:201,
    User:
    {
        delBlock
    }
});
});

//getBlockList
exports.blockList=catchAsync(async(req,res,next)=>{
console.log('USER IS : ',req.user._id);
    const block=await Block.find({
        creator:req.user._id
    });

console.log('BLOCK LIST IS AS FOLLOWS : ',block);

if(block.length===0)
{
    return res.status(400).json({
        message:'No block-list found!',
        reason:'You have not blocked any-one',
        status:400
    });
};

res.status(200).json({
    message:'Your block list found!',
    reason:'You blocked some-one',
    status:200,
    length:block.length,
    BlockList:
    {
        block
    }
});
});

//updateBlock
exports.updateBlock=handlerFactory.updateOne(Block);

//delteBlock
exports.deleteBlock=handlerFactory.deleteOne(Block);