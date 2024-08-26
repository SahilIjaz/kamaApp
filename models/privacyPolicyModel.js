const mongoose=require('mongoose')

const privacyPolicySchema=new mongoose.Schema({
    policy:{
        type:String,
        required:[true,'Policy is compulsory.']
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},
{timestamps:true});

privacyPolicySchema.pre(/^find/,function(next){
    this.populate({
        path:'creator',
        select:'name email gender location'
    });
    next();
});

const PrivacyPolicy=mongoose.model('PrivacyPolicy',privacyPolicySchema);
module.exports=PrivacyPolicy;
