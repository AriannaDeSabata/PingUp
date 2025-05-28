import React from 'react'
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './StyleNavBar.css'

export default function NavBar() {

  const navigate = useNavigate()

    const handleLogout = ()=>{
      const token = localStorage.getItem("token")
      if(token){
        localStorage.removeItem("token")
        navigate('/')
      }
    }

  return (
    <Navbar expand="md" className="bg-body-tertiary mb-3 ">
    <Container fluid={"md"} >

     {/* <Link to={'/profile'}><img src='https://img.freepik.com/vettori-premium/personaggio-avatar-isolato_729149-194801.jpg?semt=ais_hybrid&w=740' alt='avatar'className='avatar'/></Link>
*/}
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
