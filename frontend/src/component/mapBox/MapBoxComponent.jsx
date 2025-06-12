import React, { useEffect, useRef, useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AddPingFormComponents from './AddPingFormComponents'
import api from '../../../service/api'
import '@fortawesome/fontawesome-free/css/all.min.css';
import SearchFormComponent from './SearchFormComponent'
import PingDetailsComponent from './PingDetailsComponent'
import { SearchBox } from '@mapbox/search-js-react'
import './styleMapBox.css'


export default function MapBoxComponent({city}) {

    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    const [showFormPing, setShowFormPing] = useState(false)
    const [showFormSearch, setShowFormSearch] =useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])

    const [allPings, setAllPings] = useState([])
    const [pings, setPings] = useState([])
    const [detailsPing, setDetailsPing] = useState()

    const [inputValue, setInputValue] = useState("")

    const [errMsg, setErrMsg] = useState("")
    const [showErr, setShowErr] = useState(false)


    mapboxgl.accessToken= accessToken

    //recupero di tutti i ping
    const getAllPing = async()=>{
      try {
        const res = await api.get('/ping')
        setPings(res.data)
        setAllPings(res.data)

      } catch (error) {
        console.error("Error fetching pings: ", error)
        setErrMsg("Failed to load pings. Please try again later!")
        setShowErr(true)
      }
    }

    //Carica la mappa centrata sulla città dell'utente e imposta i controlli
    useEffect(()=>{
        if(!city) return

        const loadMapWithCity = async()=>{
          //endpoint per il geocoding di city 
            const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`
            )
            const data = await res.json();
            const coords = data.features[0].center;
            if(!coords){
                console.error("Error: Coordinates not found")
                return
            }
            //creo la mappa solo se non esiste già
            if(!mapRef.current){
                mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/arids/cmbs5rhqw000o01qw74a54i50',
                center: coords,
                zoom: 7
            })

            //button per la navigazione nella mappa
               mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')


               //Modifica la dimensione dei marker in base allo zoom
              mapRef.current.on('zoom', () => {
                  const zoom = mapRef.current.getZoom()

                  markersRef.current.forEach(marker => {
                    const el = marker.getElement()

                    const size = Math.max(10, zoom * 5) 
                    el.style.width = `${size}px`;
                    el.style.height = `${size}px`;

                    
                    const iconEl = el.querySelector('.iconEl')
                    if(iconEl) {
                      iconEl.style.fontSize = `${size * 0.5}px` 
                    }
                  })
                })
            }

           getAllPing()

        }

        loadMapWithCity()

        //pulizia della mappa quando il componente viene smontato 
        return () => {
        if(mapRef.current){
          mapRef.current.remove()
        }
        mapRef.current = null
    }
    },[city])

    //aggiungi marker alla mappa
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
    <>    
      {showErr && <Alert variant="danger">{errMsg}</Alert>}


      <div className='position-relative'>
              <SearchBox
                accessToken={accessToken}
                className="searchBoxMap"
                map={mapRef.current}
                mapboxgl={mapboxgl}
                value={inputValue}
                onChange={(val) => setInputValue(val)}
                options={{
                  types: ['place', 'poi'],
                }}
              />

          <div ref={mapContainerRef} className='mapContainer'></div>

            <button className='addPing buttonMap'onClick={()=>{
              setShowFormPing(true)
              setShowFormSearch(false)
              setShowDetails(false)
              }}>
                <i className="fa-solid fa-plus"></i>
              </button>

            {showFormPing &&(
              <AddPingFormComponents setShowFormPing={setShowFormPing} setPings={setPings} pings={pings}/>
            )}

            <button className='searchBtn buttonMap' onClick={()=>{
              setShowFormSearch(true)
              setShowFormPing(false)
              setShowDetails(false)
              }}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {showFormSearch && (
              <SearchFormComponent pings={pings} setPings={setPings} setShowFormSearch={setShowFormSearch}  allPings={allPings} map={mapRef.current}/>
            )}

            {showDetails && (
              <PingDetailsComponent setShowDetails={setShowDetails} detailsPing={detailsPing}/>
            )}
      </div>



     </>

  )
}
