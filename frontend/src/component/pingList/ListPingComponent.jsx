import React, { useEffect, useState } from 'react'
import { Alert, Button, Card} from 'react-bootstrap'
import './styleList.css'
import api from '../../../service/api.js'

export default function ListPingComponent({list, isJoined, fetchUser, id}) {

    const [showAlert, setShowAlert ] = useState(false)
    const [msg, setMsg] = useState('')

    //controllo lista ping se è vuota mostra allert
    useEffect(()=>{
      if (!list || list.length === 0){
        setMsg("No pings available")
        setShowAlert(true)
      }else{
        setShowAlert(false) 
      }
    },[list])

    //abbandonare un ping a cui l'utente si è aggiunto
    const leavePing = async(id)=>{
      try {
        const res = await api.put(`ping/leave/${id}` )

        fetchUser()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

    //eliminare un ping
    const deletePing = async (id)=>{
      try {
        const res = await api.delete('/ping/'+ id)
        console.log(res.data.message)
         await fetchUser()

      } catch (error) {
        console.error(error)

      }
    }


  return (
    <>
      {!showAlert && (
        list.map((el, i) =>(
            <Card key={i} border={isJoined ? "danger" : "primary"}  className='my-3 cardList '>
            <Card.Header>
              <i className={el.icon}></i>
            </Card.Header>

            <Card.Body>

              <Card.Title>
                  {el.category}
              </Card.Title>

              <Card.Text>
                {el.description}
              </Card.Text>
                <div className='d-flex justify-content-between gap-3'>
                  <span className='date'>{new Date(el.date).toLocaleDateString()}</span>
                  <div className='d-flex gap-2 align-items-center'>
                    <i className="fa-solid fa-location-dot"></i>
                    <p>{el.city}</p>
                  </div>

                </div>

             {!isJoined && id === undefined  && (
              <Button onClick={()=>deletePing(el._id)} className='btn-danger btnList'>Delete Ping</Button>
             )}   

             {isJoined && (
              <Button 
              className='btn-warning btnList'
              onClick={(e)=> {
                e.preventDefault()
                leavePing(el._id)
              }}
                >Leave</Button>
            )}

            </Card.Body>
          </Card>

        ))
      )}

      {showAlert && (
        <Alert  variant='none' className='alertList my-3'>
          {msg}
        </Alert>
      )}
    </>
  )
}
