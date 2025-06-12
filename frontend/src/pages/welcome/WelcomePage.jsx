import { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './styleWelcomePage.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function WelcomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if(window.scrollY > 10){
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>    
      <div className='wrapper'>
        <DotLottieReact
          src="https://lottie.host/92f275fe-f1c7-43c5-96bc-77582e739567/YaxnkKbXOk.lottie"
          loop
          autoplay
          className='bgLottie'
        />
      </div>

      <Container className='text-center px-5 contentOverlay' fluid="md">

        <Row>
          <Col md={12} className='contW'>
            <h1 className="fadeIn">Welcome to PingUp</h1>
          </Col>

          <Col md={12} className={scrolled ? 'visible contW' : 'hidden contW '}>

              <p className={scrolled ? 'visible descW' : 'hidden descW'}>
                PingUp brings sports to your fingertips: find, create, and join local sports events with friends and new teammates, all in real-time and on the map!
              </p>

          </Col>
          <Col md={12} className={scrolled ? 'visible contW' : 'hidden contW '}>

          <p className='mb-4' >Join the community or sign up to create your first event.</p>
          <div>
              <Button className="btn-dark btnLogW  me-3">
                  <Link to="/login" className="link">Login</Link>
                </Button>
                <Button className="btn-dark btnRegW ">
                  <Link to="/register" className="link">Register</Link>
                </Button>
            </div>

          </Col>
        </Row>
      </Container>
    </>

  )
}
