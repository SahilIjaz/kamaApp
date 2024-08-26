const handleFactory=require('../controllers/handlerFactory');
const PrivacyPolicy=require('../models/privacyPolicyModel');
const cathcAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');

//creator
// exports.creator=cathcAsync(async(req,res,next)=>{
//     req.body.creator=req.user._id;
//     next();
// });

//createPolicy
exports.createPolicy=cathcAsync(async(req,res,next)=>{

    const ePolicy=await PrivacyPolicy.find();

    if(ePolicy.length!==0)
{return res.status(400).json({
        message:'policy already exists!',
        status:400
    });
};

    const policy=await PrivacyPolicy.create({
        policy:req.body.policy,
    });

    if(!policy)
    {return next(new appError('Policy was not created!',404));};

    policy.creator=req.user._id;
    await policy.save();

    res.status(200).json({
        message:'Policy has successfully een created!',
        status:200,
        PrivacyPolicy:{
            policy
        }
    });
});

//readPolicy
exports.readPolicy=handleFactory.getAll(PrivacyPolicy);

//updatePolicy
exports.updatePolicy=handleFactory.updateOne(PrivacyPolicy);

//deletePolicy
exports.deletePolicy=cathcAsync(async(req,res,next)=>{

    const ePolicy=await PrivacyPolicy.find();

    if(ePolicy.length===0)
    {return res.status(400).json({
        messaage:'No policy cretaed!',
        result:'No policy can be deleted',
        status:400
    });
};

const policy=await PrivacyPolicy.deleteMany(req.params.id);

if(!policy)
{return next(new appError('Policy was not deleted!',404));};

res.status(200).json({
    message:'Plicy deleted successfully!',
    status:200,
    Policy:{
        policy:null
    }
});
});