const mongoose=require('mongoose');

const termsAndConditionSchema=new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    terms:{
        type:String,
        required:[true,'Terms are compulsory!']
    }
},
{timestamps:true});

termsAndConditionSchema.pre(/^find/,function(next){
    this.populate({
        path:'creator',
        select:'name email image'
    })
    next()
})

const TermsAndCondition=mongoose.model('TermsAndConditions',termsAndConditionSchema)
module.exports=TermsAndCondition