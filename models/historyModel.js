const { default: mongoose } = require('mongoose');
const mongose=require('mongoose');

const historySchema=new mongose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    history:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking'
    }
});


historySchema.pre(/^find/,function(next){
    this.populate({
        path:'creator',
        select:'name email gender location'
    })
    this.populate({
        path:'history'
    });
    next();
});

const History=mongoose.model('History',historySchema);
module.exports=History;

