import React, { useEffect, useState } from 'react'
import {  Container, ListGroup, Spinner } from 'react-bootstrap'
import api from '../../../service/api'
import './styleChatPage.css'
import { useNavigate } from 'react-router-dom'



export default function ChatPage() {
  
  const [allChats, setAllChats]= useState([])
  const navigate = useNavigate()
  const [selectedChat, setSelectedChat] = useState(false)


  //recupero di tutte le chat dell'utente tramite token
  const getAllChat = async()=>{
    try {
      const res = await api.get('/chat')
      setAllChats(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  //reinderizzo l'utente al componente chat
  const handleChatClick = (chat)=>{
      setSelectedChat(true)
      setTimeout(()=>{
        navigate(`/chat/${chat._id}`, {state: chat})
      },300)
  }

  useEffect(()=>{
    getAllChat()
  },[])




  return (
    <Container fluid={"md"}>

      <div className='contChats'>
        <div className='d-flex gap-3 align-items-center contHeader' >
          <i className="fa-solid fa-comments iconTitle"></i>
          <h3>Chats</h3>
        </div>

              {allChats.length === 0 && (
                  <div className='msgLoading text-center'>
                    <h5 >There are no chats at the moment, add yourself to a ping"</h5>
                        <Spinner animation="grow" size="sm" />
                  </div>
                )}

            <ListGroup className='p-2'>
              {allChats.map((chat, i ) => (
                <ListGroup.Item 
                    key={i} 
                    className={`chatItem ${selectedChat ? 'chatSelected' : ''}`}
                    action
                    onClick={()=> handleChatClick(chat)}
                    >
                  <div className='d-flex align-items-center gap-3'>
                    <i className={`chatIcon ${chat.ping.icon}`}></i>
                    <p className='m-0'>{chat.ping.category}</p>
                  </div>
                    <div className='d-flex gap-3 p-2'>
                      <span>{new Date(chat.ping.date).toLocaleDateString()}</span>
                      <span>Participants ({chat.participants.length || 0})</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
      </div>


    </Container>
  )
}
