import express from 'express'
import pingModel from '../models/PingModel.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const route = express.Router()

//rotta per la creazione di un ping
route.post('/', authMiddleware, async(req, res, next)=>{
    try {
        const idUser = req.user.id

        const newPing = new pingModel({
            ...req.body,
            creatorId: idUser
        })
    
        const saveNewPing = await newPing.save()

        res.status(200).json(saveNewPing)

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
        })

        res.status(200).json(pings)

    } catch (error) {
        next(error)
    }
})

//rotta per cancellare un ping
route.delete('/:id', authMiddleware, async(req, res, next)=>{
    try {
        
        const id = req.params.id
        await pingModel.findByIdAndDelete(id)

        res.status(200).json({message: "Ping eliminato con successo"})

    } catch (error) {
        next(error)
    }
})


//rotta per partecipare a un ping
route.put('/join/:id', authMiddleware, async(req , res, next)=>{
    try {
        const idPing = req.params.id
        const idUser = req.user.id
        const newParticipant = {
            user: idUser
        }

        const ping = await pingModel.findByIdAndUpdate(idPing,{
             $push:{
                participants: newParticipant
             }
        }).populate({
            path: "participants",
            select: ["name","surname", "avatar"]
        })

        res.status(200).json({messagge: "Partecipante aggiunto", ping})

    } catch (error) {
        next(error)
    }
})


//rotta per lasciare un ping(non partecipare più)



export default route