import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styleMapbox.css' 
import AddPingFormComponents from './AddPingFormComponents'
import api from '../../../service/api'
import '@fortawesome/fontawesome-free/css/all.min.css';
import SearchFormComponent from './SearchFormComponent'
import PingDetailsComponent from './PingDetailsComponent'
import { SearchBox } from '@mapbox/search-js-react'


export default function MapBoxComponent({city, setCity}) {
    mapboxgl.accessToken= import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    const [showFormPing, setShowFormPing] = useState(false)
    const [showFormSearch, setShowFormSearch] =useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])
    const [allPings, setAllPings] = useState([])
    const [pings, setPings] = useState([])
    const [detailsPing, setDetailsPing] = useState()
    const [inputValue, setInputValue] = useState("");

    const accessToken = 'pk.eyJ1IjoiYXJpZHMiLCJhIjoiY21iNjhkMDdoMmgxcDJqcXpqejZzdGpnaiJ9.opFAeIpz9wc4LDDDOfcehA'

    const getAllPing = async()=>{
      try {
        const res = await api.get('/ping')
        setPings(res.data)
        setAllPings(res.data)

      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        if(!city) return

        const loadMapWithCity = async()=>{

            const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`
            )
            const data = await res.json();
            const coords = data.features[0].center;
            if(!coords){
                console.log("errore coordinate non trovate")
                return
            }

            if(!mapRef.current){
                mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/arids/cmb69umbi00mm01r20lvs460m',
                center: coords,
                zoom: 7
            })

               mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
            }

           getAllPing()

        }

        loadMapWithCity()


        return () => {
        if(mapRef.current){
          mapRef.current.remove()
        }
        mapRef.current = null
    }
    },[city])

    useEffect(()=>{

      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []

      pings.forEach(ping =>{
        const [lat, lng] =ping.location.coordinates

        const el = document.createElement('div')
        el.classList.add('iconMarker')
        
        const iconEl = document.createElement('i')
        iconEl.className = ping.icon
        iconEl.classList.add('iconEl')

        el.appendChild(iconEl)

        const popupContent = `
            <button id= "detailsBtn">Details</button>
          `

        const popup = new mapboxgl.Popup().setHTML(popupContent)
        const marker = new mapboxgl.Marker(el)
        .setLngLat([lng , lat])
        .setPopup(popup)
        .addTo(mapRef.current)

        popup.on('open', ()=>{
          const btn = document.getElementById("detailsBtn")
          btn.addEventListener('click',()=>{
            setShowDetails(true)
            setDetailsPing(ping)
            setShowFormPing(false)
            setShowFormSearch(false)
          })
        })

        markersRef.current.push(marker)
      })
    },[pings])



  return (
    <Container className='py-3 px-0 '>
      <Row className='gx-0'>
        <Col xs={12} className='position-relative'>
              <SearchBox
                  accessToken={accessToken}
                  map={mapRef.current}
                  mapboxgl={mapboxgl}
                  value={inputValue}
                  onChange={(d) => {
                    setInputValue(d);
                  }}
                />

        <div ref={mapContainerRef} className='mapContainer'></div>

          <button className='addPing buttonMap'onClick={()=>{
            setShowFormPing(true)
            setShowFormSearch(false)
            setDetailsPing(false)
            }}>
              <i className="fa-solid fa-plus"></i>
            </button>

          {showFormPing &&(
            <AddPingFormComponents setShowFormPing={setShowFormPing} setPings={setPings} pings={pings}/>
          )}

          <button className='searchBtn buttonMap' onClick={()=>{
            setShowFormSearch(true)
            setShowFormPing(false)
            setDetailsPing(false)
            }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>

          {showFormSearch && (
            <SearchFormComponent pings={pings} setPings={setPings} setShowFormSearch={setShowFormSearch}  allPings={allPings} map={mapRef.current}/>
          )}

          {showDetails && (
            <PingDetailsComponent setShowDetails={setShowDetails} detailsPing={detailsPing}/>
          )}
        </Col>
      </Row>
    </Container>
  )
}
