import React, { useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styleMapbox.css' 
import AddPingFormComponents from './AddPingFormComponents'


export default function MapBoxComponent({city}) {
    mapboxgl.accessToken= import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    const [showFormPing, setShowFormPing] = useState(false)
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)

    useEffect(()=>{
        if(!city) return

        const loadMapWithCity = async()=>{

            const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`
            )
            const data = await res.json();

            const coords = data.features[0]?.center;
            if(!coords){
                console.log("errore coordinate non trovate")
                return
            }

            if(!mapRef.current){
                mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/arids/cmb69umbi00mm01r20lvs460m',
                center: coords,
                zoom: 9
            })

            }
            }

        loadMapWithCity()
        
        return () => {
        mapRef.current?.remove()
        mapRef.current = null
    }
    },[city])

  return (
    <Container fluid={'md'} className='p-3'>
        <div className='position-relative'>
        <div ref={mapContainerRef} className='mapContainer'>
        </div>
          <button className='addPing'onClick={e=>setShowFormPing(true)}>+</button>
          {showFormPing &&(
            <AddPingFormComponents setShowFormPing={setShowFormPing}/>
          )}

        </div>
    </Container>
  )
}
