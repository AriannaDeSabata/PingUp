import mongoose from "mongoose";
import iconsCategory from "./iconsCategory.js"


const pingSchema = new mongoose.Schema({
    category : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    city:{
        type: String,
    },
    location:{
        type: { 
            type: String, 
            default: 'Point' }, 
            
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    description:{
        type: String,
        required: true
    },
    icon:{
        type: String
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    participants: [
        {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            },
            _id : false
        }
    ],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }

},
{
    timestamps: true
})




pingSchema.pre("save", function(next){
    this.icon = iconsCategory[this.category]|| "fa-solid fa-circle-question"
    next()
})

pingSchema.index({ location: '2dsphere' })


const pingModel = mongoose.model("Pings", pingSchema)

export default pingModel