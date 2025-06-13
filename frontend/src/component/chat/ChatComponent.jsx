import React, {  useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../service/api'
import socket from '../../../socket-client'
import { Container } from 'react-bootstrap'
import './styleChatComponent.css'

export default function ChatComponent({user}) {
    

    const {id} = useParams()
    const [chat, setChat] = useState(null)
    const [message, setMessage] = useState("")
    const [allMessages, setAllMessages] = useState([])
    const navigate = useNavigate()


    //recupera i dati dalla chat e unisce l'utente alla stanza socket
    useEffect(()=>{
        const fetchChatAndJoin = async()=>{
            try {
                const res = await api.get(`/chat/${id}`)
                setChat(res.data)
                setAllMessages(res.data.messages)
                socket.emit("join_chat", res.data._id)
                
            } catch (error) {
                console.log(error)
            }
        }
            fetchChatAndJoin()

    },[id])

    //ricevi i nuovi messaggi dal socket in tempo reale
    useEffect(() => {
        const handleMessage = (data) => {
            setAllMessages(prevMessages => [...prevMessages, data])
        }

        socket.on("send_message", handleMessage)
        return () => socket.off("send_message", handleMessage)
    }, [])

    //Invia un nuovo messaggio
    const handleSend = ()=>{
        socket.emit("send_message",{
            chatId: chat._id,
            senderId: user._id,
            text: message
        })
        setMessage("")
    }

    //Torna alla lista della chat
    const handleBack = ()=>{
        navigate('/chat')
    }

    if(!chat) return <p className='text-center'>Loading chat...</p>

  return (

        <Container >
        <div className='contChat'> 
            <div className='d-flex mb-2'>
                <div className='infoChat'>
                    <div className='d-flex align-items-center gap-3'>
                        <i className={`chatIcon ${chat.ping.icon}`}></i>
                        <p >{chat.ping.category}</p>

                        <p>{new Date(chat.ping.date).toLocaleDateString()}</p>

                    </div>
                </div>
                <button className='btnBack' onClick={handleBack}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
            </div>

            <div className="chatMessages" >
            {allMessages.map((msg) => (
                <div
                key={msg._id}
                className={`message ${msg.sender._id === user._id ? 'myMessage' : 'theirMessage'}`}
                >
                <img   
                alt='userAvatar'
                src={msg.sender._id === user._id ? user.avatar : msg.sender.avatar}className='avatarChatMsg'
                />
                <p>{msg.text}</p>
                </div>
            ))}
            </div>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className='textArea'
                onKeyDown={(e)=>{
                    if(e.key === "Enter" && !e.shiftKey ){
                        e.preventDefault()
                        handleSend()
                    }
                }}
            ></textarea>
            <button onClick={handleSend} className='btnSendMsg'>Invia</button>
        </div>
        </Container>


)
}
