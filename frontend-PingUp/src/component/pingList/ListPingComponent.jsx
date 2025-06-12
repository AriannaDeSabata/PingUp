import React, { useEffect, useState } from 'react'
import { Alert, Button, Card} from 'react-bootstrap'
import './styleList.css'
import api from '../../../service/api.js'
export default function ListPingComponent({list, isJoined, fetchUser}) {


    const [showAlert, setShowAlert ] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(()=>{
      if (!list || list.length === 0){
        setMsg("No pings available")
        setShowAlert(true)
      }else{
        setShowAlert(false) 
      }
    },[list])

    const leavePing = async(id)=>{
      try {
        const res = await api.put(`ping/leave/${id}` )


        fetchUser()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

    const deletePing = async ()=>{
      console.log("eliminato")
    }


  return (
    <>
      {!showAlert && (
        list.map((el, i) =>(
            <Card key={i} border={isJoined ? "danger" : "primary"}  className='mb-3 '>
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
                <div className='d-flex justify-content-between'>
                  <span className='date'>{new Date(el.date).toLocaleDateString()}</span>
                  <p>{el.city}</p>
                </div>

             {!isJoined && (
              <Button onClick={deletePing} className='btn-danger btnList'>Delete</Button>
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
        <Alert  variant='none' className='alertList'>
          {msg}
        </Alert>
      )}
    </>
  )
}
