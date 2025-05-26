import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import pingModel from "./PingModel.js";
import chatModel from "./ChatModel.js";
import messageModel from "./MessageModel.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true,
        trim: true
    },
    avatar: { 
        type: String, 
        default: 'https://ui-avatars.com/api/?name=User&background=random' 
    },
    pingsJoined : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pings'
        }
    ]
},
{
    timestamps: true
}
)

userSchema.pre("save", async function(next) {

    if (!this.isModified('password')) return next()

    try {

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND))
        this.password = await bcrypt.hash(this.password, salt)
        next()

    } catch (error) {

        next(error)
    }
})

userSchema.pre("findOneAndDelete", async function(next){

        const query= this.getQuery()
        const userId = query._id

        const pingsToDelete = await pingModel.find({creatorId : userId})
        const pingsId = pingsToDelete.map(p =>p._id)

        //elimino i ping creati dall'utente
        await pingModel.deleteMany({creatorId: userId})

        //elimino tutte le chat dei ping eliminati
        await chatModel.deleteMany({ping: {$in: pingsId}})

        //rimuovo l'utente dai ping a cui si era aggiunto
        await pingModel.updateMany({},{$pull: {participants: {user: userId}}})

        //rimuovo l'utente dalle chat a cui era statp aggiunto
        await chatModel.updateMany({},{$pull: {participants: userId}})
        
        //elimino i messaggi dell'utente
        await messageModel.deleteMany({sender: userId})

    next()
})

const userModel = mongoose.model("Users", userSchema)

export default userModel
