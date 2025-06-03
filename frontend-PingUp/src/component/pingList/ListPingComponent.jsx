import React, { useEffect, useState } from 'react'
import { Alert, Button, ListGroup } from 'react-bootstrap'
import './styleList.css'

export default function ListPingComponent({list, isJoined}) {

    const [listPings, setListPings] = useState([])
    const [showAlert, setShowAlert ] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(()=>{
      if (!list || list.length === 0){
        setMsg("No pings available")
        setShowAlert(true)
      }else{
        setListPings(list)
      }
    },[list])

  return (
    <ListGroup>
      {!showAlert && (
        listPings.map((el, i) =>(
          <ListGroup.Item key={i} className='listItem my-2'>
            <div className='d-flex align-items-center gap-3'>
              <i className={el.icon}></i>
              <p>{el.category}</p>
            </div>
            <div className='d-flex justify-content-between'>
              <p>{el.description}</p>
              <span className='date'>{new Date(el.date).toLocaleDateString()}</span>
              <p>{el.city}</p>
            </div>
            {isJoined && (
              <Button>Leave</Button>
            )}
          </ListGroup.Item>
        ))
      )}

      {showAlert && (
        <Alert  variant='warning' className='text-center'>
          {msg}
        </Alert>
      )}
    </ListGroup>
  )
}
