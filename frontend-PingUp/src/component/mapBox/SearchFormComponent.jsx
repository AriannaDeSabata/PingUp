import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import categories from './categories'
import Select from 'react-select'

export default function SearchFormComponent({pings, setPings, setCity,setShowFormSearch, allPings}) {

    const [categorySelected, setCategorySelected] = useState(null)
    const [dateSearch, setDateSearch] = useState(null)

    const options = categories.map(cat=>({value: cat, label: cat}))

  //aggiorno lo stato con la categoria selezionata
    const handleChangeCategory =(e)=>{
        setCategorySelected(e.value)
    }
    //filtro i ping in base alla categoria o alla data
    const handleSubmit = ()=>{
        if(categorySelected !== null || dateSearch !== null){
          const filteredPings = allPings.filter(ping =>{
            return ping.category.includes(categorySelected) || ping.date.includes(dateSearch)
          })

          setPings(filteredPings)
          setShowFormSearch(false)
        }
      }

    //ripristino l'elenco dei pings
      const handleReset = ()=>{
        setPings(allPings)
        setShowFormSearch(false)
      }
    
  return (
    <div className='form'>
        <Form className='formGroup'>
        <div>
          <button 
            type= "button"
            onClick={e => setShowFormSearch(false)}className='closeForm'
            >x</button>

          <h6>Search Ping</h6>
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
            <Form.Control type='date' onChange={(e)=>setDateSearch(e.target.value)} ></Form.Control>
        </Form.Group>

        <Button className='mt-2' onClick={handleSubmit}>Search</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Form>
    </div>
  )
}
