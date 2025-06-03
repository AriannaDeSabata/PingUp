import express from 'express'
import userModel from '../models/UserModel.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import uploadAvatar from '../service/paramsCloudinary.js'

const route = express.Router()

//rotta per recuperare tutti gli utenti 
route.get('/', async(req , res ,next)=>{
    try {
        
        const users = await userModel.find()
        res.status(200).json(users)

    } catch (error) {
        next(error)
    }
})

//rotta per il recupero di un'utente tramite id
route.get('/:id', async(req , res, next)=>{
    try {
        const id = req.params.id
        const user = await userModel.findById(id)
        .populate({
            path: "pingsJoined",
            select: ["category", "date", "icon", "location", "description", "chat", "city"]
        })
        .populate({
            path: "pingsCreated",
            select: ["category", "date", "icon", "location", "description", "chat", "city"]
        })
        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
})

//rotta per il caricamento img profilo
route.put('/avatar', authMiddleware, uploadAvatar.single('avatar'), async(req ,res, next)=>{
    try {
        const idUser = req.user.id
        const user = await userModel.findByIdAndUpdate(
            idUser,
            {avatar: req.file.path},
            {new: true}
        )
    
        await user.save()
        res.status(200).json({message: "immagine modificata", user})

    } catch (error) {
        next(error)
    }
} )


export default route