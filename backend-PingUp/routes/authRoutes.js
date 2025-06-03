import express from 'express'
import userModel from '../models/UserModel.js'
import generateToken from '../service/generateToken.js'
import bcrypt from 'bcrypt'
import authMiddleware from '../middlewares/authMiddleware.js'
import pingModel from '../models/PingModel.js'
import chatModel from '../models/ChatModel.js'
import messageModel from '../models/MessageModel.js'

const route = express.Router()

//rotta per login
route.post('/login', async(req ,res ,next)=>{
    try {
        const {email, password } = req.body
        const userLogin = await userModel.findOne({email})

        if(userLogin){
            const pswCompare = await bcrypt.compare(password, userLogin.password)

            if(pswCompare){
                const token = await generateToken({
                        id: userLogin.id,
                        name: userLogin.name,
                        surname: userLogin.surname,
                        avatar: userLogin.avatar

                })

                res.status(200).json({
                    message: "Login successful",
                    token
                })

            }else{
                res.status(400).json({message: "Password erratta!"})
            }
        }else{
            res.status(400).json({message: "Email non valida"})
        }


    } catch (error) {
        next(error)
    }
})


//rotta per la registrazione
route.post('/register', async(req, res, next)=>{
    try {
        const email = req.body.email
        
        const existUser = await userModel.findOne({email})
        if(existUser){
            return res.status(400).json({message : "An account with this email already exists"})
        }

        const newUser = new userModel(req.body)

        const userSave = await newUser.save()

        const token = await generateToken({
            id: userSave.id,
            name: userSave.name,
            surname: userSave.surname,
            avatar: userSave.avatar
        })

        res.status(200).json({
            message: "Registration successfull!", 
            token
        })

    } catch (error) {
        next(error)
    }


})


//rotta per recuperare l'utente loggato
route.get('/me', authMiddleware , async(req ,res ,next)=>{
    try {

        const user = await userModel.findById(req.user._id)
        .populate({
            path: "pingsJoined",
            select: ["category", "date", "icon", "description", "chat", "city"]
        })
        .populate({
            path: "pingsCreated",
            select: ["category", "date", "icon", "location", "description", "chat", "city"]
        })
        
        if(!user){
            return res.status(400).json({message: "user Not Found"})
        }


        const { password, ...safeUser } = user.toObject()
        res.status(200).json(safeUser)

        } catch (error) {
            next(error)
        }
    } )

//rotta per modificare l'utente tramite id
route.put('/me', authMiddleware, async(req ,res ,next)=>{
    try {
        const obj = req.body
        const id = req.user.id

        const userUpdate = await userModel.findByIdAndUpdate(id, obj, {new: true})

        res.status(200).json({
            message: "Updated user",
            userUpdate
        })

    } catch (error) {
        next(error)
    }
})

//rotta per eliminare un'utente
route.delete('/me', authMiddleware, async(req ,res ,next)=>{
    try {
        
        const id = req.user.id
        const user = await userModel.findById(id)

        if(user._id.toString() !== id){
            return res.status(404).json({message: "Unauthorized"})
        }
        

        await userModel.findByIdAndDelete(id)

        res.status(200).json({message: "User successfully deleted"})

    } catch (error) {
        next(error)
    }
})



export default route

