const User=require('../models/userModel');
const TermsAndCondition=require('../models/termsAndConditionsMode');
const handleFactory=require('./handlerFactory');
const catchAsync=require('../utils/caychAsync');
const appError=require('../utils/appError');

//setCreator
exports.setCreator = catchAsync(async (req, res, next) => {
    req.body.creator = req.user.id;
    next();
});

//createTermsAndCOnditions
exports.createTermsAndCOnditions=catchAsync(async(req,res,next)=>{

    const pre_termsAndCondition=await TermsAndCondition.find();

    if(pre_termsAndCondition.length>1)
    {return next(new appError('ALready exists  , can-not made more than one.',404))};

const termsAndCondition=await TermsAndCondition.create(req.body);

if(!termsAndCondition)
{return next(new appError('Terms And Conditions not created!',404))};

res.status(200).json({
    message:'Terms and conditions created successfully !',
    status:200,
    termsAndCondition
});
});

//readTermsAndConditions
exports.readTermsAndConditions=handleFactory.getAll(TermsAndCondition);

//updateTermsAndConditions
exports.updateTermsAndConditions=handleFactory.updateOne(TermsAndCondition);

//deleteTermsAndCOnditions
exports.deleteTermsAndConditions=catchAsync(async(req,res,next)=>{

    const pre_termsAndCondition=await TermsAndCondition.find();

    if(pre_termsAndCondition.length<1)
    {return res.status(400).json({
        message:'Terms and conditions can-not be deletd !',
        status:400,
        reason:'There exists no terms ad conditions',
        length:pre_termsAndCondition.length,
        pre_termsAndCondition
    })};

const termsAndConditions=await TermsAndCondition.deleteMany();

if(!termsAndConditions)
{return next(new appError('Not deleted !',404))};

res.status(200).json({
    message:'Terms and conditions deleted successfully !',
    status:200,
    length:termsAndConditions.length,
    termsAndConditions
});
});

