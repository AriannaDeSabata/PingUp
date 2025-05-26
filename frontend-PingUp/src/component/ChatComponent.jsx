
import { useParams } from "react-router-dom"
import socket from "../../socket-client"
import { useEffect, useState } from "react"

export default function ChatComponent({user}) {

    const {chatId} = useParams()
    const [message, setMessage] = useState("")
    const [allMessage, setAllMessage] = useState([])

    useEffect(()=>{
        socket.emit("join:chat", chatId)

        socket.on('chat:message', (msg)=>{
            setMessage((prev)=>[...prev, msg])
        })

        return ()=>{
            socket.off("chat:message")
        }
    },[chatId])


    const handleSend =()=>{
        if(message.trim()){
            socket.emit("chat:message",{
                chatId,
                sender: user._id,
                text: message
            })
            setMessage('')
        }
    }

  return (
    <div>
     <h2>Chat Room</h2>
      <div>
        {messages.map((m) => (
          <div key={m._id}>
            <strong>{m.sender.name}</strong>: {m.text}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Scrivi un messaggio"
      />
      <button onClick={handleSend}>Invia</button>
    </div>
  )
}
