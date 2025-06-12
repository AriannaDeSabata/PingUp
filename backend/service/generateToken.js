import "dotenv/config"
import jwt from 'jsonwebtoken'

const jwtSecretKey = process.env.JWT_SECRET_KEY

const generateTokenJWT = (payload)=>{
    return new Promise((res,rej) =>{
        jwt.sign(
            payload,
            jwtSecretKey,
            {expiresIn: "30 day"},
            (err, token)=>{
                if(err) rej(err)
                    else res(token)
            }
        )
    }

)}

export default generateTokenJWT