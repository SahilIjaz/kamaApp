const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ],
    lastMessageSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    },
    lastMessage: {
    type: String,
    },
    messageTime: {
    type: Number,
    },
},
{ timestamps: true });


chatSchema.pre(/^find/,function(next){
    this.populate({
        path:'users',
        select:'name email gender location'
    })
    this.populate({
        path:'lastMessageSender',
        salect:'name email gender location'
    });
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
