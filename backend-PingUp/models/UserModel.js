import mongoose from "mongoose";
import bcrypt from 'bcrypt'

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

const userModel = mongoose.model("Users", userSchema)

export default userModel
