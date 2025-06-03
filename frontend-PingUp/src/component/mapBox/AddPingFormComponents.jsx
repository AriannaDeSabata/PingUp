import React, { useState } from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'
import categories from './categories'
import { SearchBox } from "@mapbox/search-js-react"
import api from '../../../service/api.js'
import Select from 'react-select'

export default function AddPingFormComponents({setShowFormPing,setPings, pings }) {

  const [value, setValue] = React.useState('')
  const [categorySelected, setCategorySelected] = useState(null) 
  const options = categories.map(cat=>({value: cat, label: cat}))   
  
  const handleChangeCategory =(e)=>{
        setCategorySelected(e.value)
    }


  const [ping, setPing]= useState({
    category: '',
    date: '',
    description: '',
    city: '',
    location: {
      coordinates:[]
    }
  })

  const handleChangeLoc =(d)=>{
    setValue(d);
  }
  const handleChange = (e) => {
    setPing({
      ...ping,
      [e.target.name] : e.target.value,
      category : categorySelected
    })
  }

  const postPing = async()=>{

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
        setShowFormPing(false)
        console.log("ping aggiunto con successo")
        setPings([...pings, res.data])
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit= (e)=>{
    e.preventDefault()
    postPing()

  }

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
                proximity: {
                  lng: -122.431297,
                  lat: 37.773972,
                },
              }}
              name='location'
              value={value}
              onChange={handleChangeLoc}
              onRetrieve={handleLocation}
              accessToken="pk.eyJ1IjoiYXJpZHMiLCJhIjoiY21iNjhkMDdoMmgxcDJqcXpqejZzdGpnaiJ9.opFAeIpz9wc4LDDDOfcehA"
            />
        </Form.Group>
        <Button className='mt-2' onClick={handleSubmit}>Create</Button>
      </Form>
    </div>
  )
}
