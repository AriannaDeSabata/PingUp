import React from 'react'
import { Container } from 'react-bootstrap'
import './styleNotFound.css'


export default function NotFoundComponent() {
  return (
    <Container fluid={"md"} className='p-5 notFound'>
        <div className='cardNotFound'> 
            <h1>Page not found!!</h1>
            <p>The page you are looking for does not exist!</p>
        </div>
    </Container>
  )
}
