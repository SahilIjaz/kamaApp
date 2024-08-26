const mongoose=require('mongoose');

const blockSchema=new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    blocked:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

blockSchema.pre(/^find/,function(){
    this.populate({
        path:'creator',
        select:'name email gender location'
    })
    this.populate({
        path:'blocked',
        select:'name email gender location'
    })
});

const Block=mongoose.model('Block',blockSchema);
module.exports=Block;