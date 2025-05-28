import React, { useState } from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'
import categories from './categories'
import { SearchBox } from "@mapbox/search-js-react"
import api from '../../../service/api.js'

export default function AddPingFormComponents({setShowFormPing}) {

  const [value, setValue] = React.useState('')
  const [search, setSearch] = useState('')
  const [showList, setShowList] = useState(false)
  const filterCategory = categories.filter(cat =>
    cat.toLowerCase().startsWith(search.toLowerCase())
  )

  const [ping, setPing]= useState({
    category: '',
    date: '',
    description: '',
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
      [e.target.name] : e.target.value
    })
  }

  const postPing = async()=>{

    const newPing = {
      category: ping.category,
      date: ping.date,
      description: ping.description,
      location: ping.location
    }

    try {
      const res = await api.post('/ping', newPing)
      if(res.status === 200 || res.status === 201){
        console.log(res)
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

    setPing({
      ...ping,
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
          <Form.Control
            type="text"
            placeholder='Category'
            name="category"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowList(true)
              handleChange(e)
            }}
            onFocus={() => setShowList(true)}
            onBlur={() =>
              setTimeout(() => setShowList(false), 150) // timeout per lasciare cliccare sulla lista
            }

          />
          {showList && filterCategory.length > 0 && (
            <ListGroup className='list'>
              {filterCategory.map((cat) => (
                <ListGroup.Item
                  key={cat}
                  action
                  onMouseDown={() => {
                    setSearch(cat)
                    setShowList(false)
                    setPing({
                      ...ping,
                      category: cat
                    })
                  }}
                >
                  {cat}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
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
