const mongoose = require('mongoose');

const  friendRequestSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined'], 
        default: 'pending' 
    },
     isRead: {
    type: Boolean,
    default: false
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

const friendRequest=mongoose.model('friendRequest',friendRequestSchema);

module.export=friendRequest;
