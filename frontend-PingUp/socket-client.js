import { io } from "socket.io-client"


const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001") // o la tua URL backend

export default socket