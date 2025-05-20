import express from 'express'
import "dotenv/config"
import mongoose from 'mongoose'
import cors from 'cors'
import errorMiddlewares from './middlewares/errorMiddlewares.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import pingRoutes from './routes/pingRoutes.js'


const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.URL_FRONTEND || "http://localhost:3000",
    credentials: true
}))


app.use(errorMiddlewares.handleUnauthorized)
app.use(errorMiddlewares.handleBadRequest)
app.use(errorMiddlewares.handleError)
app.use(errorMiddlewares.handleNotfound)


app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/ping', pingRoutes)

app.get('/', (req,res)=>{
    res.json({message: "app connect"})
})

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected")

        app.listen(process.env.PORT, ()=>{
            console.log("Server is running on " + process.env.PORT)
        })
    } catch (error) {
        console.error("MongoDB connection error:" , error)
        process.exit(1)

    }
}

connectDB()