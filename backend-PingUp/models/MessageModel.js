import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    ping:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pings',
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

const messageModel = mongoose.model("Messagges", messageSchema)

export default messageModel