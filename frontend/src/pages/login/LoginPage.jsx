import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../service/api.js'

export default function LoginPage() {

  const [msg, setMsg] = useState('')
  const [showAlertMsg, setShowAlertMsg] = useState()

  const [loginUser, setLoginUser] = useState({
    email: '',
    password:''
  })

  const navigate = useNavigate()

  //recupero i dati dal form è aggiorno lo stato loginUser
  const handleChange = (e)=> {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value
    })
  }

  //invio i dati di login al backend 
  const handleSubmit= async (e)=>{
    e.preventDefault()
    
    try {
        if(!loginUser.email || !loginUser.password){
          setMsg("Fill in all fields")
          setShowAlertMsg(true)
          return
        }

        const res = await api.post('/auth/login', loginUser)
        const token = res.data.token
        localStorage.setItem("token", token)
        navigate('/home')


    } catch (error) {
      console.error('Login Failed'+ error)
      setMsg(error.response.data.message)
      setTimeout(()=>{
          setShowAlertMsg(true)
      }, 2000)



    }

  }


  return (
    <Container fluid={"md"} className='mt-10 p-5'>
      <h1 className='titleForm '>Login</h1>
      <Form className='d-flex justify-content-center'>

        <Form.Group className='formRegLog' >
          <Form.Control type='email' name='email' placeholder='Email'onChange={handleChange} value={loginUser.email}/>

          <Form.Control type='password' name='password' placeholder='password' onChange={handleChange} value={loginUser.password}/>


        {showAlertMsg && (
          <p className='errorMsg'>{msg}</p>
        )}

        <Button onClick={handleSubmit}>Login</Button>

        <Link to="/register" className="linkFormRegLog">Don't have an account? <span>Register</span></Link>
        </Form.Group>



      </Form>
    </Container>
  )
}
