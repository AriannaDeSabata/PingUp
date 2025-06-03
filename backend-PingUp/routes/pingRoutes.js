import express from 'express'
import pingModel from '../models/PingModel.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import chatModel from '../models/ChatModel.js'
import userModel from '../models/UserModel.js'

const route = express.Router()

//rotta per la creazione di un ping
route.post('/', authMiddleware, async(req, res, next)=>{
    try {
        const idUser = req.user.id

        const newPing = new pingModel({
            ...req.body,
            creatorId: idUser
        })
    
       const newChat = await chatModel.create({
            ping: newPing._id,
            participants: [idUser],
            messages:[]
        })
        
        newPing.chat = newChat._id

        const saveNewPing = await newPing.save()

        const userUpdate = await userModel.findByIdAndUpdate(
            idUser,
            { $addToSet: { pingsCreated: newPing._id } },
            { new: true }
            )

        res.status(200).json(newPing)

    } catch (error) {
        next(error)
    }
})

//rotta per recuperare tutti i ping e o filtrarli
route.get('/', authMiddleware, async(req, res, next)=>{
    try {
        
        const pings = await pingModel.find()
        .populate({
            path: "creatorId",
            select: ["name", "surname", "avatar"]
        }).populate({
            path: "participants.user",
            select: ["name","surname", "avatar"]

        })

        res.status(200).json(pings)

    } catch (error) {
        next(error)
    }
})


//rotta per recuperare un ping
route.get('/:id', authMiddleware, async(req, res, next)=>{
    try {
        const id = req.params.id
        const ping = await pingModel.findById(id).populate({
            path: "creatorId",
            select: ["name", "surname", "avatar"]
        })

        res.status(200).json(ping)

    } catch (error) {
        next(error)
    }
})


//rotta per cancellare un ping
route.delete('/:id', authMiddleware, async(req, res, next)=>{
    try {
        const idUser = req.user.id
        const id = req.params.id
        
        const ping = await pingModel.findById(id)

        if(!ping){
            return res.status(404).json({message: "Ping not found"})
        }

        if(ping.creatorId.toString() !== idUser){
            return res.status(401).json({message: "Unauthorized"})
        }

        await pingModel.findByIdAndDelete(id)

        res.status(200).json({message: "Ping deleted successfully"})

    } catch (error) {
        next(error)
    }
})


//rotta per partecipare a un ping
route.put('/join/:id', authMiddleware, async(req , res, next)=>{
    try {
        const idPing = req.params.id
        const idUser = req.user.id

        const ping = await pingModel.findById(idPing)
        if(!ping){
            return res.status(404).json({message: "Ping not found"})
        }
        
        if(ping.creatorId.toString() === idUser){
            return res.status(400).json({message: "You are already in the chat"})
        }

        const alreadyInPing = ping.participants.some(p => p.user.toString() === idUser)
        if(!alreadyInPing){
            ping.participants.push({user: idUser})
            await ping.save()
        }else if(alreadyInPing){
            return res.status(400).json({message: "You are already a participant"})
        }

        const chat = await chatModel.findOne({ping: idPing})
        if(!chat){
            return res.status(404).json({message: "Associated chat not found "})
        }

        const alreadyInChat = chat.participants.some(p=> p.toString()=== idUser)
        if(!alreadyInChat){
            chat.participants.push(idUser)
            await chat.save()
        }

            const updatedUser = await userModel.findByIdAndUpdate(
            idUser,
            { $addToSet: { pingsJoined: idPing } },
            { new: true }
            )

        res.status(200).json({message: "You have been added", ping})

    } catch (error) {
        next(error)
    }
})


//rotta per lasciare un ping(non partecipare più)
route.put('/leave/:id', authMiddleware, async(req, res, next)=>{
    try {
        const idPing = req.params.id
        const idUser = req.user.id
        const ping = await pingModel.findById(idPing)

        if(!ping){
            return res.status(400).json({message: "Ping not found"})
        }
        ping.participants.pull({user:idUser})
        await ping.save()

        res.status(200).json({messagge: "You left the event"})

    } catch (error) {
        next(error)
    }
})



export default route