import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './StyleNavBar.css'


export default function NavBar({user, setUser}) {

    const navigate = useNavigate()

    //rimuove i dati dell'utente dallo storage locale e reindirizza alla home
    const handleLogout = ()=>{
      if(user){
        localStorage.removeItem("token")
        localStorage.removeItem('user')
        setUser(null)
        navigate('/')
      }
    }

  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" fixed='top'>
    <Container className='mx-md-3' fluid={"fluid"}>

      <div className='d-flex align-items-center gap-3'>
        {user &&(
            <Link to={'/profile'}><img src={user.avatar} alt='avatar'className='avatar btnRotate '/></Link>
        )}
          <Navbar.Brand href="/" className='brand'>PingUp</Navbar.Brand>

      </div>



      <div>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        placement="end"
        className="bg-dark text-white"
        data-bs-theme="dark"
        >
        <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
            Menu
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Nav className="contLinkNav">
              {user && (
                <Link to="/home" className='linkNav'>Map</Link>
              )}

                {!user && (
                  <>
                  <Link to="/register" className='linkNav' >Sign up</Link>
                  <Link to="/login" className='linkNav'>Login</Link>
                  </>
                )}
                {user &&(
                  <>
                     <Link to={'/chat'} className='chatLink d-none d-md-flex btnRotate'>
                        <i className="fa-regular fa-comments"></i>
                      </Link>

                     <Link to={'/chat'}  className='linkNav d-md-none'>
                        Chat
                      </Link>

                      <Link to="/profile" className='linkNav'>Profile</Link>
                 

                      <button className='logOut 'onClick={handleLogout}>LogOut</button>
                  </>

                )}

            </Nav>
        </Offcanvas.Body>
        </Navbar.Offcanvas>
      </div>

    </Container>
    </Navbar>

  )
}
