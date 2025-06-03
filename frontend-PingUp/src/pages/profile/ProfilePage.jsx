import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import './styleProfile.css'
import { useParams } from 'react-router-dom'
import api from '../../../service/api'
import ListPingComponent from '../../component/pingList/ListPingComponent'


export default function ProfilePage() {

  const [profileData, setProfileData] =useState(null)
  const [listPingsJoined, setListPingsJoined] = useState([])
  const [listPingsCreated, setListPingCreated] = useState([])
  const [isJoined, setIsJoined] = useState(true)

  const {id} = useParams()

  const getUserId = async()=>{
    try {
      const res = await api.get('/user/'+ id)
      setProfileData(res.data)
      setListPingsJoined(res.data.pingsJoined)
      setListPingCreated(res.data.pingsCreated)


    } catch (error) {
      console.log(error)
    }
  }

useEffect(() => {
  const getMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setProfileData(res.data)
      setListPingsJoined(res.data.pingsJoined)
      setListPingCreated(res.data.pingsCreated)
      console.log(res.data.pingsCreated)

    } catch (error) {
      console.log(error)
    }
  }

  if (!id) {
    getMe()
  } else {
    getUserId()
  }
}, [id])


  if(!profileData){
    return (
      <div className='d-flex justify-content-center mt-5'>
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <Container>
      <Row >
        <Col className='colProfile p-3 mb-5' xs={12}>
            <div >
              <img src={profileData.avatar} alt='img avatar' className='avatarProfile'/>

            </div>
            <div className='d-flex justify-content-center flex-column'>
              <h3>{profileData.name} {profileData.surname}</h3>

              <div className='contInfo'>
                <i className="fa-solid fa-envelope"></i>
                <p>{profileData.email}</p>
              </div>


              <div className='contInfo'>
                <i className="fa-solid fa-location-dot"></i>
                <p>{profileData.city}</p>
              </div>

            </div>

        </Col>

        <Col xs={12} md={6} className='contPingsCreated'>
            <h6 className='text-center'>Pings Created</h6>
            <ListPingComponent list={listPingsCreated}  />
        </Col>

        <Col xs={12} md={6} className='contPingsJoin'>
          <h6 className='text-center'>Pings Joined</h6>
          <ListPingComponent list={listPingsJoined} isJoined={isJoined}/>
        </Col>
      </Row>

    </Container>
  )
}
