const appError=require('../utils/appError');
const OTP=require('../utils/otpGenerator');
const createaToken=require('../utils/tokenGenerator');
const Review=require('../controllers/reviewControllers');
const catchAsync=require('../utils/caychAsync');
const Booking=require('../models/bookingModel');
const MeetingLocation=require('../models/meetingLocationModel');
const Like=require('../models/likeModel');
const History=require('../models/historyModel');
const Block=require('../models/blockModel');
const Report=require('../models/reportModel');
const User=require('../models/userModel');
const util = require('util');
const jwt=require('jsonwebtoken');

//signUpUser
exports.signUp=catchAsync(async(req,res,next)=>{
    console.log('1');
const user=await User.create(req.body);
console.log('2');
if(!user)
{return next(new appError('user not created!',404))};
console.log('3');
const otpSent=await OTP(user.email);
console.log('4');
user.otpExpiration=Date.now() + 1 * 60 * 1000;
console.log('5');
user.otp=otpSent;
console.log('6');
await user.save();
console.log('7');
res.status(200).json({
    message:'user signed up',
    status:200,
    OTP:otpSent,
    user
});
});

//resendOTP
exports.resendOTP=catchAsync(async(req,res,next)=>{
    console.log('Resend otp hit ! ');

    const user=await User.findOne({email:req.body.email});

    if(!user)
    {  return next(new appError('User not fund !',404))};
console.log('User checked !');

    const otpSent=await OTP(user.email);

user.otpExpiration=Date.now() + 1 * 60 * 1000;
user.otp=otpSent;
await user.save();
console.log('otp sent and saved with new time');

res.status(200).json({
    messge:'OTP sent again',
status:200,
OTP_Is:otpSent,
user
});
});

//OtpVerification
exports.otpVerifivation=catchAsync(async(req,res,next)=>{
    const preUser=await User.findOne({email:req.body.email});

    if(!preUser)
    {return next(new appError('This email is in_valid',404))};

    const user = await User.findOne({
        email: req.body.email,
        otpExpiration: { $gt : Date.now() }
});

if(!user)
{ 
    return res.status(400).json({
        message:'error occured',
        status:400,
        issue:'OTP expired',
        hint:'request for OTP again'
})
};

if(!req.body.otp)
{
    return res.status(404).json({
        message:'user not found',
        status:400,
        issue:'OTP not provided'
})
};

if(req.body.otp!=user.otp)
{
    return res.status(404).json({
        message:"OTP verificsation failed",
        status:400,
        issue:'OTP provided was in-correct'
    })
};

user.isVerified_OTP=true;
await user.save();

res.status(200).json({
    message:'OTP verified successfully !',
    status:200,
    user
});
});


//logIn
exports.logIn=catchAsync(async(req,res,next)=>{
    console.log('API HIT >>>> ');
const {email,password} =req.body;

    const user=await User.findOne({email});
    if(!user)
    {return next(new appError('User do-not exists!',404))};
    console.log('user exists!');

    if(!password)
    {return next('Password not provided!',404)};
    console.log('password provided');

    const passwordCorrect=await user.checkPassword(password,user.password);
    if(!passwordCorrect)
    {return next(new appError('Password is in-correct !',404))};
    console.log('password checked');

    const token=createaToken(user._id);

    console.log('Token generated !')
    res.status(200).json({
        message:'loggedIn successfully!',
        Token:token,
        status:200,
        user
    });
});



//forgotPassword
exports.forgotPassword=catchAsync(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user)
    {return next(new appError('User do-not exist!',404))};

    const otpSent=await OTP(user.email);

    user.otpExpiration=Date.now() + 1 * 60 * 1000;
    user.otp=otpSent;
    user.isVerified_OTP=false;
    await user.save();
    console.log('otp sent and saved with new time');

    res.status(200).json({
        message:'OTP sent for email verification',
        status:200,
        user
    });
});


//resetPassword
exports.resetPassword=catchAsync(async(req,res,next)=>{
const {email}=req.body;

    const fuser=await User.findOne({email});

    if(!fuser)
    {return next(new appError('User do-not exists check your email',404))};

    const user=await User.findOne({email,
        isVerified_OTP:true});

    if(!req.body.password||!req.body.confirmPassword)
    {return next(new appError('Password and confirm password both are required!',404))};

user.password=req.body.password;
user.confirmPassword=req.body.confirmPassword;
user.isVerified_OTP=true;
await user.save();

    res.status(200).json({
        message:'Password reset successfully !',
        status:200,
        user
    });
});

//deleteUser
exports.deleteUser=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;

const user=await User.findOne({email});

if(!user)
{return next('User not-found!',404)};

console.log('4');
if(!password)
{return next(new appError('Prvide your password PLz !',404))};

const passwordCorrect=await user.checkPassword(password,user.password);
if(!passwordCorrect)
{return next(new appError('Incorrect password !',404))};

console.log('password checked');
console.log('password checked');
console.log('7');
const otpSent=await OTP(email);

user.otpExpiration=Date.now() + 1 * 60 * 1000;
user.otp=otpSent;
user.isVerified_OTP=false;
await user.save();
console.log('otp sent and saved with new time');

res.status(200).json({
    message:'OTP sent for deleting account',
    status:200,
    OTP:otpSent,
    user
});
});

//dleteMe
exports.deleteMe=catchAsync(async(req,res,next)=>{

const {email,otp}=req.body;

    const user=await User.findOne({email});

    if(!user)
    {return next(new appError('User not-found!',404));};

    if(!otp)
    {return next(new appError('Please provide OTP sent at your Email',404));};

    if(otp!==user.otp)
    {return next(new appError('Invalid OTP provided !',404));};

    user.isVerified_OTP=true;
    user.isDeleted=true;

    await user.save();

    res.status(200).json({
        message:'user deleted successfully !',
        status:200,
        user
    });
});

//deleteOneUser
exports.deleteOneUser=catchAsync(async(req,res,next)=>{

    const user=await User.findById(req.params.id);

    if(!user)
    {return next(new appError('User not fund !',404));};

    await Review.deleteMany({
        $or:
        [
            {creator:user._id},
            {receiver:user._id}
        ]
    });
    
    await Booking.deleteMany({
        $or:
        [
            {creator:user._id},
            {booked:user._id}
        ]
    });

    await MeetingLocation.deleteMany({
        $or:
        [
            {creator:user._id},
            {meetingPerson:user._id}
        ]
    });

    await History.deleteMany({
        creator:user._id
    });

    await Block.deleteMany({
        $or:
        [
            {creator:user._id},
            {blocked:user._id}
        ]
    });

    await Like.deleteMany({
        $or:
        [
            {creator:user._id},
            {liked:user._id}
        ]
    });

    await Report.deleteMany({
        $or:
        [
            {report:user._id},
            {creator:user._id}
        ]
    })

res.status(200).json({
        message:'USer has been completely deletd !',
        status:200,
        deleted:true,
        Data:null
    });
});


//>>*---------------protect-------------------
exports.protect = catchAsync(async (req, res, next) => {
    console.log("API HIT");
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
    return next(new appError('Log-in in order to get Access!', 401));
    }
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('DECODED IS : ', decoded);
    // Ensure the ID is correctly extracted
    const freshUser = await User.findById(decoded.id);
    console.log('Done ');
    if (!freshUser) {
    return next(new appError('This user no longer exists.', 401));
    }
  console.log('DONE WITH THIS API')
    req.user = freshUser;
    console.log('Done ');
    next();
  });

//restrictTo
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You are not authorized to perform this action.',
                status: 403
            });
        }
        next(); 
    };
};