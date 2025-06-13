import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../service/api'

export default function PingDetailsComponent({setShowDetails, detailsPing}) {
  
  const [msg, setMsg]= useState("")
  const [showAlertMsg, setShowAlertMsg] = useState(false)
  const [showBtnJoin, setShowBtnJoin] = useState(true)
  const idPing = detailsPing._id
  const navigate = useNavigate()

  // Al caricamento del componente, controlla se l'utente loggato è già presente nella lista dei partecipanti del ping.
  // Se l'utente è presente, nascondi il pulsante "Join".
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(user)
    if(    
      detailsPing &&
      Array.isArray(detailsPing.participants) &&
      user &&
      detailsPing.participants.some(p => p.user._id === user._id))
      {
        setShowBtnJoin(false)
    }
  },[detailsPing])


  //funzione per unirsi a un ping 
    const joinPing = async()=>{
      try {
        const res = await api.put('/ping/join/' + idPing )
        console.log(res)
        if(res.status === 200){
          setMsg(res.data.message)
          setShowAlertMsg(true)
          setShowBtnJoin(false)
          setTimeout(()=>{
            navigate(`/chat/${detailsPing.chat}`)
          },2000)

        }

      } catch (error) {
        if(error.response.status === 400){
        setMsg(error.response.data.message)
          setShowAlertMsg(true)
          setTimeout(()=>{
            setShowAlertMsg(false)
          },3000)

      }else{
        setMsg("Something went wrong")
        setShowAlertMsg(true)
          setTimeout(()=>{
            setShowAlertMsg(false)
          },3000)
      }
    }}


  return (
    <div className='form'>
        <div>
          <button onClick={e=>setShowDetails(false)} className='closeForm'>x</button>
            <div className='d-flex flex-column gap-3'>

                <div className='d-flex align-items-center gap-3'> 
                    <i className={detailsPing.icon}></i>
                    <h3>{detailsPing.category}</h3>
                </div>

                <span className='datePing'>{new Date(detailsPing.date).toLocaleDateString()}</span>
              <div>
                  <h6>Creatore</h6>
                  <div className='d-flex gap-3 align-items-center'>
                      <img src={detailsPing.creatorId.avatar} className='imgUser'/>
                      <Link className='linkProfile' to={`/profile/${detailsPing.creatorId._id}`}>{detailsPing.creatorId.name} {detailsPing.creatorId.surname}</Link>
                  </div>
              </div>

              <div>
                <h6>Description</h6>
                <p className='descriptionPing'>{detailsPing.description}</p>
              </div>
                {showAlertMsg && (
                    <Alert variant={"light"}>{msg}</Alert>
                )}
                {showBtnJoin && (
                    <Button className='btn-success' onClick={joinPing}>Join</Button>
                )}


            </div>
        </div>
    </div>
  )
}
