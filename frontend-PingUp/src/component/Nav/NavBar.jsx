import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './StyleNavBar.css'


export default function NavBar({user, setUser}) {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const handleLogout = ()=>{

      if(token){
        localStorage.removeItem("token")
        localStorage.removeItem('user')
        setUser(null)
        navigate('/')
      }
    }

  return (
    <Navbar expand="md" className="bg-body-tertiary mb-3">
    <Container >

      {user &&(
          <Link to={'/profile'}><img src={user.avatar} alt='avatar'className='avatar me-3'/></Link>
      )}


        <Navbar.Brand href="/" className='brand'>PingUp</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        placement="end"
        >
        <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
            Menu
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3 gap-2">
                <Link to="/home" className='linkNav'>Home</Link>
                <Link to="/register" className='linkNav'>Register</Link>
                <Link to="/login" className='linkNav'>Login</Link>
                <button className='logOut'onClick={handleLogout}>LogOut</button>
            </Nav>
        </Offcanvas.Body>
        </Navbar.Offcanvas>

    </Container>
    </Navbar>

  )
}
