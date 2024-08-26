const mongoose=require('mongoose');

const feedBackSchema=new mongoose.Schema({
    feedBack:{
        type:String,
        required:[true,'FeedBack is required']
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{timestamps:true});


feedBackSchema.pre(/^find/,function(next){
    this.populate({
        path:'creator',
        select:'name email gender location'
    });
    next();
});


feedBackSchema.statics.deleteAll = async function() {
    return this.deleteMany({});
};

const FeedBack=mongoose.model('FeedBack',feedBackSchema);
module.exports=FeedBack;