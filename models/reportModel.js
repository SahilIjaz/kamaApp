const mongoose=require('mongoose')

const reportSchema=new mongoose.Schema({
    reported:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reason:{
        type:String,
        required:[true,'Reason must be enterred.']
    },
    description:{
        type:String,
        required:[true,'Description is required fo rreason provided.']
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true});


reportSchema.pre(/^find/,function(next){
    this.populate({
        path:'reported',
        select:'name email gender location'
    })
    this.populate({
        path:'creator',
        select:'name email gender location'
    });
    next();
});

const Report=mongoose.model('Report',reportSchema)
module.exports=Report

