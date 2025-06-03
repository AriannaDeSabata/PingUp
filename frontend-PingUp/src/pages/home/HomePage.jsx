import React, { useEffect, useState } from 'react'
import MapBoxComponent from '../../component/mapBox/MapBoxComponent'
import api from '../../../service/api'

export default function HomePage({setUser}) {

    const [city, setCity] = useState('')

    const getMe = async ()=>{
      try {
        const resUser = await api.get('/auth/me')
        localStorage.setItem("user", JSON.stringify(resUser.data))
        setCity(resUser.data.city)
        setUser(resUser.data)

      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
          getMe()
        }
    },[])

    
  return (
    <div>
      {city? (
      <MapBoxComponent city={city} setCity={setCity} />
    ) : (
      <p>Caricamento mappa...</p>
    )}
    </div>
  )
}
