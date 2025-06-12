import React from 'react'
import {  Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ListPingComponent({ping}) {

  return (
    <Col xs={12}  >
       <Card >
          <Card.Header className='contPingInfo'>
            <div className='d-flex gap-3 align-items-center'> 
                <i class={ping.icon}></i>
                <Card.Title className='m-0'>{ping.category}</Card.Title>
            </div>
            <div className='d-flex gap-3 align-items-center'>
                <Link to={'/'} >{ping.creatorId.name} {ping.creatorId.surname}</Link>
                <img src={ping.creatorId.avatar} alt="imgCreator" className='imgCreatorePing'  />

            </div>
          </Card.Header>
          <Card.Body>
            <p>{ping.description}</p>
            <p>{new Date(ping.date).toLocaleDateString()}</p>
          </Card.Body>
          <button  className='btnJoin'>Join</button>
        </Card>
    </Col>
  )
}
