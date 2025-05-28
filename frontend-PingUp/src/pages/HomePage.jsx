import React, { useEffect, useState } from 'react'
import MapBoxComponent from '../component/mapBox/MapBoxComponent'
import api from '../../service/api.js'


export default function HomePage({setUser}) {

      const [city, setcity] = useState('')
      const [pings, setPings] = useState([])

      const getMe = async(token)=>{
      try {
        const resUser = await api.get('/auth/me',{
          headers:{
            Authorization: `Bearer ${token}`
          }

        })
          setUser(resUser.data)
          setcity(resUser.data.city)

      } catch (error) {
        console.log(error)
      }
    }


    useEffect(()=>{
          const token = localStorage.getItem("token")
      if(token){
        getMe(token)
      }
    },[])

  return (
    <div>
      {city? (
      <MapBoxComponent city={city} />
    ) : (
      <p>Caricamento mappa...</p>
    )}
    </div>
  )
}
