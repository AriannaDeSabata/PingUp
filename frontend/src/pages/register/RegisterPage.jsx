import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../service/api'


export default function RegisterPage() {

  const navigate = useNavigate()
  const [showMsgDeny, setShowMsgDeny] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Stato per raccogliere i dati dell'utente
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPsw: "",
    city: ""
  })

  // Stato per raccogliere i dati dell'utente
  const postNewUser = async()=>{
    try {
    
        // Funzione per inviare i dati al backend
        if(!userData.name || !userData.surname || !userData.email || !userData.password || !userData.city){
          setShowMsgDeny(true)
          setErrorMsg("Fill in all fields!")
          setTimeout(()=>setShowMsgDeny(false), 6000)
          return
          // Controllo corrispondenza password
        }else if(userData.password !== userData.confirmPsw){
          setShowMsgDeny(true)
          setErrorMsg("The password do not match")
          setTimeout(()=>setShowMsgDeny(false), 6000)
          return
        }

        const newUser ={
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: userData.password,
          city: userData.city
        }

        const response = await api.post('/auth/register', newUser)

        if(response.status === 201 || response.status === 200){
          localStorage.setItem("token", response.data.token)
          navigate('/home')
        }


    } catch (error) {
      const msg = error.response?.data?.message || 'Somenthing went wrong!'
      setErrorMsg(msg)
      setShowMsgDeny(true)
      setTimeout(()=> setShowMsgDeny(false), 6000)
    }

  }
  //recupero i dati dal form
  const handleChange = (e) =>{
    setUserData({
          ...userData,
          [e.target.name]: e.target.value
    })
  }

  //invio dati
  const handleSubmit = (e)=>{
    e.preventDefault()
    postNewUser()

  }

  return (
    <Container fluid="sm" className='mt-10 py-5'>
      <h1 className='titleForm'>Register</h1>
      <Form className='d-flex justify-content-center'>

        <Form.Group  className='formRegLog'>

          <Form.Control type='text' name='name' placeholder='Name' value={userData.name} onChange={handleChange}/>

          <Form.Control type='text' name='surname' placeholder='Surname' value={userData.surname} onChange={handleChange}/>

          <Form.Control type='email' name='email' placeholder='Email'  value={userData.email} onChange={handleChange}/>

          <Form.Control type='password' name='password' placeholder='password' value={userData.password} onChange={handleChange} />

          <Form.Control type='password' name='confirmPsw' placeholder='Confirm Password' value={userData.confirmPsw} onChange={handleChange}/>

          <Form.Control type='text' name='city' placeholder='City'value={userData.city} onChange={handleChange}/>


        {showMsgDeny &&(
          <p className='styleAlert'>{errorMsg}</p>
        )}

          <Button className='btn-warning' onClick={handleSubmit}>Register</Button>
          <Link to="/login" className="linkFormRegLog">You already have an account? <span>Login</span></Link>

        </Form.Group>

      </Form>
    </Container>
  )
}
