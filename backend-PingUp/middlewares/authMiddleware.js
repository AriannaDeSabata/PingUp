import 'dotenv/config'
import jwt from 'jsonwebtoken'
import userModel from '../models/UserModel.js'
import mongoose from 'mongoose'

const jwtSecretkey = process.env.JWT_SECRET_KEY

const authMiddleware = async(req, res, next)=>{
    try {
        
        const tokenBearer = req.headers.authorization

        if(tokenBearer !== undefined){
            const token = tokenBearer.replace('Bearer ' , '')
            const data = await verifyJWT(token)

            if(!mongoose.isValidObjectId(data.id)){
                return res.status(400).json({message: "Invalid token"})
            }

            if(data.exp){
                const userFound = await userModel.findById(data.id)

                if(userFound){
                    req.user = userFound
                    return next()
                    
                }else{
                    return res.status(400).send("User not found")
                }
            }else{
                return res.status(401).send("Please login again")
            }
        }else{
            return res.status(403).send("Token required")
        }

    } catch (error) {
        next("Token error" + error)
    }
}


const verifyJWT = (token)=>{
    return new Promise((res,rej)=>{
        jwt.verify(token, jwtSecretkey, (err, data)=>{
            if(err) rej(err)
                else res(data)
        })
    })
}


export default authMiddleware