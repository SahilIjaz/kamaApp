const mongoose=require('mongoose');
const validator=require('validator');
const crypto=require('crypto');
const bcrypt = require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
},
email: {
    type: String,
    unique: true,
    required: [true, "Provide email"],
    validate: [validator.isEmail, "please provide a valid email"],
},
password:{
    type:String,
},
confirmPassword:{
    type:String,
    validate:{ 
        validator:function (el) {
        return el===this.password}}
},
otp:Number,
otpExpiration:{
    type:Number
},
number: String,
bio: {
    type: String,
},
age: Number,
    image: {
        type: String,
        default:
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
    },
Gender:{
    type:String,
    enum:['male','female','diverse','Not-relavant'],
    required:[true,'Gender is compulsory.'],
},
role:{
    type:String,
    enum:['user','professional','admin'],
    required:[true,'Provide your role'],
    default:'user'
},
location: {
        type: {
        type: String,
        default: "Point",
        },
        coordinates: {type: [Number], default: [0.0, 0.0]},
        address: String,
        description: String
    },
    services:{
        type:String,
        enum:[`massage`,`councelling`,`companionShip`,`intimate companionShip`],
        default:'massage'
    },
    profrileCompleted:{
        type:Boolean,
        default:false
    },
isDeleted:{
    type:Boolean,
    default:false
},
rating:{
    type:Number
},
isVerified_OTP:{
    type:Boolean,
    default:false
}},
{timestamps:true});


//password encryption
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password =await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    } catch (err) {
        next(err);
    }
});


//:::::::::::::::::pre hooks 
userSchema.pre(/^find/,function(next){
    console.log('DELTE IN USER MODEL');
    this.find
    ({
        isDeleted:false
    });
    console.log('DELTE end IN USER MODEL');
    next();
});



//password checking
userSchema.methods.checkPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
};




const User=mongoose.model('User',userSchema);
module.exports=User;