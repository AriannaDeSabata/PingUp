import React, { useState } from 'react'
import { Alert, Button, Form, ListGroup } from 'react-bootstrap'
import categories from './categories'
import { SearchBox } from "@mapbox/search-js-react"
import api from '../../../service/api.js'
import Select from 'react-select'

export default function AddPingFormComponents({setShowFormPing,setPings, pings }) {

  const [alertMsg, setAlertMsg] = useState('')
  const [showAlertMsg, setShowAlertMsg ]= useState(false)
  const [value, setValue] = React.useState('')
  const [categorySelected, setCategorySelected] = useState(null) 
  const options = categories.map(cat=>({value: cat, label: cat}))   
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

   const [ping, setPing]= useState({
    category: '',
    date: '',
    description: '',
    city: '',
    location: {
      coordinates:[]
    }
  })
  
  //recupero la categoria 
  const handleChangeCategory =(e)=>{
        setCategorySelected(e.value)
    }


  const handleChangeLoc =(d)=>{
    setValue(d);
  }
  //aggiorno lo stato con i dati del form
  const handleChange = (e) => {
    setPing({
      ...ping,
      [e.target.name] : e.target.value,
      category : categorySelected
    })
  }
  //controlli dei campi del form, fetch per l'invio dei dati al backend
  const postPing = async()=>{
      if(!ping.category || !ping.date || !ping.description || !ping.location){
        setShowAlertMsg(true)
        setAlertMsg("Fill in all fields!!")
        setTimeout(()=>setShowAlertMsg(false),6000)
        return
      }

    const newPing = {
      category: ping.category,
      date: ping.date,
      description: ping.description,
      city: ping.city,
      location: ping.location
    }

    try {
      const res = await api.post('/ping', newPing)
      if(res.status === 200 || res.status === 201){

        setAlertMsg("Ping Added successfully!")
        setShowAlertMsg(true)
        setTimeout(()=>{
          setShowFormPing(false)
        },1000)

        setPings([...pings, res.data])
      }

    } catch (error) {
      setAlertMsg("Unexpected error occurred while submitting the ping");
      setShowAlertMsg(true);
      setTimeout(() => setShowAlertMsg(false), 6000);
    }
  }

  //invio dati
  const handleSubmit= (e)=>{
    e.preventDefault()
    postPing()

  }
  //recupero coordinate 
  const handleLocation = (res)=>{

    const loc = res.features[0]
    const coord = loc.geometry.coordinates
    const lat = coord[0]
    const lng =coord[1]
    const nameLoc = res.features[0].properties.name

    setPing({
      ...ping,
      city: nameLoc,
      location: {
        coordinates : [lng, lat]
      }
    })
  } 

  return (
    <div className="form" >

      <Form className='formGroup'>
        <div>
          <button onClick={e=>setShowFormPing(false)} className='closeForm'>x</button>
          <h6>Add new Ping</h6>
        </div>
        <Form.Group>
          <Select
            options={options}
            placeholder="Select a category"
            menuPlacement="auto"
            onChange={handleChangeCategory}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Select date</Form.Label>
          <Form.Control type='date' name='date'onChange={handleChange} value={ping.date}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text'  name='description' onChange={handleChange} value={ping.description}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Location</Form.Label>
          <SearchBox
              options={{
                type: ['place', 'poi']
              }}
              name='location'
              value={value}
              onChange={handleChangeLoc}
              onRetrieve={handleLocation}
              accessToken={accessToken}
            />
        </Form.Group>

      {showAlertMsg && (
        <p className='m-0 alertFormAdd'>
          {alertMsg}
        </p>
      )}

        <Button className='mt-2' onClick={handleSubmit}>Create</Button>
      </Form>



    </div>
  )
}
