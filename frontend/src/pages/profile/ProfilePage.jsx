import React, { useEffect, useState } from 'react'
import {  Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import './styleProfile.css'
import {  useNavigate, useParams } from 'react-router-dom'
import api from '../../../service/api'
import ListPingComponent from '../../component/pingList/ListPingComponent'
import EditFormComponent from '../../component/editForm/EditFormComponent'


export default function ProfilePage({setUser}) {

  const [profileData, setProfileData] =useState(null)
  const [listPingsJoined, setListPingsJoined] = useState([])
  const [listPingsCreated, setListPingCreated] = useState([])
  const [isJoined, setIsJoined] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showFormEdit, setShowFormEdit] = useState(false)
  const [showBtnEdit, setShowBtnEdit] = useState(false)

  const [showFormDelete, setShowFormDelete] = useState(false)
  const [errorDelete, setErrorDelete] = useState(false)
  const [msgErr, setMsgErr] = useState("")
  const navigate = useNavigate()

  const {id} = useParams()

  //recupero  dati user tramite params se esiste altrimenti tramite token
  const fetchUser = async()=>{
    try {

      const res = id 
       ?  await api.get(`/user/${id}`)
       : await api.get('/auth/me')

       if(!id){
        setShowBtnEdit(true)
        localStorage.setItem("user", JSON.stringify(res.data))
        setUser(res.data)
       }

       setProfileData(res.data)
       setListPingCreated([...res.data.pingsCreated])
       setListPingsJoined([...res.data.pingsJoined])

       setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(true)
    }
  }

  useEffect(()=>{
    fetchUser()
  },[id])

  if(loading){
    return (
      <div className='d-flex justify-content-center mt-10'>
        <Spinner animation="border" />
      </div>
    )
  }

  //evento per il form edit
  const handleEdit = (e)=>{
    e.preventDefault()
    setShowFormEdit(true)
  }

  const deleteProfile = async ()=>{
    try {
        await api.delete('/auth/me')
        localStorage.removeItem("token")
        localStorage.removeItem('user')
        setUser(null)
        navigate('/')

    } catch (error) {
      setErrorDelete(true)
      setMsgErr(error.message)
    }
  }


  const handleDeleteProfile = (e)=>{
    e.preventDefault()
    deleteProfile()
  }


  return (
    <Container className=' pe-md-5 contProfile' fluid={"fluid"}>
      <Row >
        <Col className='colProfile p-4 mb-3 mb-md-0 ' xs={12} md={4}>
        <div className='colProfileImg'> 

        </div>
            <div >
              <img src={profileData.avatar} alt='img avatar' className='avatarProfile'/>

            </div>
            <div className='mt-3'>
              <h3>{profileData.name} <br></br>{profileData.surname}</h3>

              <div className='contInfo'>
                <i className="fa-solid fa-envelope"></i>
                <p>{profileData.email}</p>
              </div>
              <div className='contInfo'>
                <i className="fa-solid fa-location-dot"></i>
                <p>{profileData.city}</p>
              </div>
          
            </div>

            {showBtnEdit && (
              <div className='contEditProfile'>
                  <Button className='btnDeleteProfile btn-danger' onClick={()=>setShowFormDelete(true)}>
                    Delete Profile
                  </Button>
                  <button 
                  className='btnEdit btnRotate'
                  onClick={handleEdit}
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>

              </div>
            )}
        </Col>

        <Col xs={12} md={4} className='contPingsCreated mb-3 mb-md-0 px-3 px-md-5  mt-md-3'>
            <h6 >Pings Created</h6>
            <ListPingComponent list={listPingsCreated}  fetchUser={fetchUser}  id={id}/>
        </Col>

        <Col xs={12} md={4} className='contPingsJoin mb-3 mb-md-0 px-3 px-md-5 mt-md-3 '>
          <h6>Pings Joined</h6>
          <ListPingComponent list={listPingsJoined} isJoined={isJoined} fetchUser={fetchUser}/>
        </Col>
      </Row>

      {showFormEdit &&(
        <EditFormComponent profileData={profileData} setShowFormEdit={setShowFormEdit} fetchUser={fetchUser}/>
      )}

      {showFormDelete && (
        <div className='form'>
          <Card className='cardDelete'>
            <Card.Header className='text-center'>Are you sure you want to delete your profile?</Card.Header>
            <Card.Body className='d-flex justify-content-center gap-3'>
              <Button className='btn-danger' onClick={handleDeleteProfile}>Delete</Button>
              <Button className='btn-success' onClick={()=>setShowFormDelete(false)}>Back</Button>
            </Card.Body>
          </Card>
        </div>
      )}


    </Container>
  )
}
