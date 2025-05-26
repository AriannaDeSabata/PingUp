import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../service/api'


export default function RegisterPage() {

  const navigate = useNavigate()
  const [showMsgDeny, setShowMsgDeny] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPsw: "",
    city: ""
  })


  const postNewUser = async()=>{
    try {
        if(!userData.name || !userData.surname || !userData.email || !userData.password || !userData.city){
          setShowMsgDeny(true)
          setErrorMsg("Fill in all fields!")
          setTimeout(()=>setShowMsgDeny(false), 6000)
          return
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

  const handleChange = (e) =>{
    setUserData({
          ...userData,
          [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    postNewUser()

  }

  return (
    <Container fluid="sm" className='my-4 py-5'>
      <h1 className='text-center mb-0'>Register</h1>
      <Form className='m-5 d-flex flex-column gap-3 '>

        <Form.Group  className='d-flex gap-3 flex-column'>

          <Form.Control type='text' name='name' placeholder='Name' value={userData.name} onChange={handleChange}/>

          <Form.Control type='text' name='surname' placeholder='Surname' value={userData.surname} onChange={handleChange}/>

          <Form.Control type='email' name='email' placeholder='Email'  value={userData.email} onChange={handleChange}/>

          <Form.Control type='password' name='password' placeholder='password' value={userData.password} onChange={handleChange} />

          <Form.Control type='password' name='confirmPsw' placeholder='Confirm Password' value={userData.confirmPsw} onChange={handleChange}/>

          <Form.Control type='text' name='city' placeholder='City'value={userData.city} onChange={handleChange}/>

        </Form.Group>

        {showMsgDeny &&(
          <p className='errorMsg'>{errorMsg}</p>
        )}

        <Form.Group className='d-flex flex-column text-center gap-1'>
          <Button className='btn-warning' onClick={handleSubmit}>Register</Button>
          <Link to="/login" className="txtRegisterLink">You already have an account? <span className='registerLink'>Login</span></Link>
        </Form.Group>
      </Form>
    </Container>
  )
}
