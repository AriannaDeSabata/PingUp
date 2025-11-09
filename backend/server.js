import express from 'express'
import "dotenv/config"
import mongoose from 'mongoose'
import cors from 'cors'
import errorMiddlewares from './middlewares/errorMiddlewares.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import pingRoutes from './routes/pingRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { Server } from 'socket.io'
import { createServer } from 'http'
import setUpSocket from './service/socket.js'


const app = express()
const server = createServer(app)
const io  = new Server(server,{
    cors: {
        origin: process.env.URL_FRONTEND || "http://localhost:5175",
        methods: ["GET", "POST"]
    }
})

setUpSocket(io)

app.use(express.json())
app.use(cors({
    origin: process.env.URL_FRONTEND || "http://localhost:5175",
    credentials: true
}))


app.use(errorMiddlewares.handleUnauthorized)
app.use(errorMiddlewares.handleBadRequest)
app.use(errorMiddlewares.handleError)
app.use(errorMiddlewares.handleNotfound)


app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/ping', pingRoutes)
app.use('/chat', chatRoutes)

app.get('/', (req,res)=>{
    res.json({message: "app connect"})
})


const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("✅ MongoDB connected")

        server.listen(process.env.PORT, ()=>{
            console.log("🚀 Server is running on " + process.env.PORT)
        })
    } catch (error) {
        console.error("❌ MongoDB connection error:" , error)
        process.exit(1)

    }
}

connectDB()