import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    text: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const messageModel = mongoose.model("Message", messageSchema)

export default messageModel