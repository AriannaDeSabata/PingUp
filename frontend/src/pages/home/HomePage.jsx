import React, { useEffect, useState } from 'react'
import MapBoxComponent from '../../component/mapBox/MapBoxComponent'
import api from '../../../service/api'
import { useNavigate } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'

export default function HomePage({user,setUser}) {

    const [city, setCity] = useState('')
    const navigate =useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    // Funzione per ottenere i dati dell'utente autenticato chiamando l'endpoint /auth/me.
    // Se la chiamata ha successo, salva i dati utente nel localStorage, aggiorna la città e lo stato user.
    const getMe = async ()=>{
      try {
        const resUser = await api.get('/auth/me')
        localStorage.setItem("user", JSON.stringify(resUser.data))
        setCity(resUser.data.city)
        setUser(resUser.data)

      } catch (error) {
         console.error("Error fetching user data:", error)
        alert("Failed to load user data. Please login again.")

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)

        navigate('/login')
      }
    }

    // useEffect: se c’è user, imposta city da user. Altrimenti, se c’è token, chiama getMe.
    useEffect(()=>{
        if(user){
          setCity(user.city)
        }else if(!user && localStorage.getItem("token")){
          getMe()
        }else{
          navigate('/')
        }
    },[])

    useEffect(()=>{
      setTimeout(()=>setIsLoading(false), 1500)
    },[])

    
  return (
    <Container className='px-0 mt-6' fluid={"fluid"}>

    {isLoading && (
      <div className='msgLoading mx-5 text-center'>
        <h3 >Preparing the map..."</h3>
        <div className='gap-5 d-flex mt-3'> 
            <Spinner animation="grow" size="sm" />
            <Spinner animation="grow" size="sm" />
            <Spinner animation="grow" size="sm" />
        </div>
      </div>
    )}

      {city && !isLoading && (
      <MapBoxComponent city={city} setCity={setCity}/>
      )}

    </Container>
  )
}
