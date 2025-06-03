import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './styleLogin.css'
import api from '../../../service/api.js'

export default function LoginPage() {
  const [loginUser, setLoginUser] = useState({
    email: '',
    password:''
  })

  const navigate = useNavigate()

  const handleChange = (e)=> {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit= async (e)=>{
    e.preventDefault()
    
    try {
        const res = await api.post('/auth/login', loginUser)
        const token = res.data.token
        localStorage.setItem("token", token)
        navigate('/home')

    } catch (error) {
      console.log('errore nel login controlla le credenziali'+ error)
    }

  }



  return (
    <Container fluid="sm" className='my-4 py-5'>
      <h1 className='text-center mb-0'>Login</h1>
      <Form className='m-5 d-flex flex-column gap-3 '>

        <Form.Group >
          <Form.Control type='email' name='email' placeholder='Email'onChange={handleChange} value={loginUser.email}/>
        </Form.Group>

        <Form.Group>
          <Form.Control type='password' name='password' placeholder='password' onChange={handleChange} value={loginUser.password}/>
        </Form.Group>

        <Form.Group className="contBtn">
            <Button className='btn-warning' onClick={handleSubmit}>
              Login
            </Button>
          <Link to="/register" className="txtRegisterLink">Don't have an account? <span className='registerLink'>Register</span></Link>
        </Form.Group>


      </Form>
    </Container>
  )
}
