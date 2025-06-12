import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    ping:{
        type: mongoose.Schema.ObjectId,
        ref: "Pings"
    },
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: "Message"
    }],
    unreadCount: {
        type: Map,
    }
})


const chatModel = mongoose.model("Chat", chatSchema)

export default chatModel