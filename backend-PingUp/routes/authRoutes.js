import express from 'express'
import userModel from '../models/UserModel.js'
import generateToken from '../service/generateToken.js'
import bcrypt from 'bcrypt'
import authMiddleware from '../middlewares/authMiddleware.js'

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
                    message: "Login avvenuto con successo",
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
            return res.status(400).json({message : "Esiste ià un'account con questa email"})
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
            message: "Registrazione avvenuta con successo", 
            token
        })

    } catch (error) {
        next(error)
    }


})


//rotta per recuperare l'utente loggato
route.get('/me', authMiddleware , async(req ,res ,next)=>{
    try {
    
        res.status(200).json(req.user)

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
            message: "Utente aggiornato",
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
        const userDelete = await userModel.findByIdAndDelete(id)

        res.status(200).json({message: "Utente cancellato con successo"})

    } catch (error) {
        next(error)
    }
})



export default route

