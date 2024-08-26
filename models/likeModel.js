const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    liked:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isLiked:{
        type:Boolean,
        default:false
    }
},
{timestamps:true});


likeSchema.pre(/^find/,function(next){
    this.populate({
        path:'liked',
        select:'name email gender location'
    })
    this.populate({
        path:'creator',
        select:'name email gender location'
    });
    next();
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;