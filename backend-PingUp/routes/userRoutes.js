import express from 'express'
import userModel from '../models/UserModel.js'

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
        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
})



export default route