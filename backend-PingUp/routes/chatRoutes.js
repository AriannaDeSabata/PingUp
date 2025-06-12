import express from 'express'
import chatModel from '../models/ChatModel.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import messageModel from '../models/MessageModel.js'

const route = express.Router()

//rotta per recuperare tutte le chat a cui partecipa l'utente 
route.get('/', authMiddleware, async(req, res, next)=>{
    try {
        const userId = req.user.id
        const chats = await chatModel.find({
            participants: userId
        })
        .populate({
            path: "ping",
            select: ["_id","category", "date","icon"]
        })
        .populate({
            path: "participants",
            select: ["name", "surname", "avatar"]
        })
        .populate({
            path: "messages",
            select: ["text"],
            populate: {
                path:"sender",
                select:["name", "surname", "avatar"]
            }
        })
        res.status(200).json(chats)

    } catch (error) {
        next(error)
    }
})

//rotta per recuperare una chat tramite id
route.get('/:id', authMiddleware, async(req ,res, next)=>{
    try {
        
        const idChat = req.params.id
        const userId = req.user.id

        const chat = await chatModel.findOne({
            _id: idChat,
            participants: userId
        })
        .populate({
            path: "ping",
            select: ["_id","category", "date", "icon"]
        })
        .populate({
            path: "participants",
            select: ["name", "surname", "avatar"]
        })
        .populate({
            path: "messages",
            select: ["text"],
            populate: {
                path:"sender",
                select:["name", "surname", "avatar"]
            }
        })

        if(!chat){
          return  res.status(404).json({message: "Chat non trovata"})
        }

        return res.status(200).json(chat)

    } catch (error) {
        next(error)
    }
})


route.get('/:id/messages',  authMiddleware, async(req,res,next)=>{
    try {
        const messages = await messageModel
        .find({chat: req.params.id })
        .populate({
            path: "sender",
            select: ["name", "surname","avatar"]
        })
        .populate({
            path: "text"
        })

        res.status(200).json(messages)

    } catch (error) {
        next(error)
    }
})

export default route