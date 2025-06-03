import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../service/api'

export default function PingDetailsComponent({setShowDetails, detailsPing}) {
  
  const [msg, setMsg]= useState("")
  const [showAlertMsg, setShowAlertMsg] = useState(false)
  const idPing = detailsPing._id

    const joinPing = async()=>{
      try {
        const res = await api.put('/ping/join/' + idPing )
        console.log(res)
        if(res.status === 200){
          setMsg(res.data.message)
          setShowAlertMsg(true)
          setTimeout(()=>{
            setShowAlertMsg(false)
          },3000)
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
                <div className='d-flex gap-3 align-items-center'>
                <div>
                    <i className={detailsPing.icon}></i>
                </div>

                <h2>{detailsPing.category}</h2>
                </div>
                <span>{new Date(detailsPing.date).toLocaleDateString()}</span>

                <div className='d-flex gap-3 align-items-center'>
                    <img src={detailsPing.creatorId.avatar} className='imgUser'/>
                    <Link to={`/profile/${detailsPing.creatorId._id}`}>{detailsPing.creatorId.name} {detailsPing.creatorId.surname}</Link>
                </div>


                <p>{detailsPing.description}</p>

                {showAlertMsg && (
                    <Alert variant={"light"}>{msg}</Alert>
                )}
                <Button onClick={joinPing}>Join</Button>

            </div>
        </div>
    </div>
  )
}
