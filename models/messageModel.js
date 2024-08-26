const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    },
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    message: {
    type: String,
    required: true,
    },
    messageTime: {
    type: Number,
    required: true,
    },
    seen: {
    type: Boolean,
    default: false,
    },
},
{ timestamps: true });

messageSchema.pre(/^find/,function(next){
    this.populate({
path:'chat'
    })
    this.populate({
path:'sender',
select:'name email gender location'
    })
    this.populate({
        path:'receiver',
        select:'name email gender location'
    });
    next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
