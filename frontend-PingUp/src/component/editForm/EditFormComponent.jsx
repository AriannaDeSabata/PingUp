import React, { useState } from 'react'
import './styleEditForm.css'
import { Button, Form } from 'react-bootstrap'
import api from '../../../service/api'


export default function EditFormComponent({profileData, setShowFormEdit, fetchUser}) {

    const [msg, setMsg] = useState("")
    const [showMsg, setShowMsg] = useState(false)
    const [fileSelected, setFileSelected] = useState(null)

    const [userUpdate, setUserUpdate] = useState({
        name: profileData.name || "",
        surname : profileData.surname || "",
        city: profileData.city || "",
        email: profileData.email || ""
    })

    //aggiorno lo stato con i dati del form 
    const handleChange = (e)=>{
        setUserUpdate({
            ...userUpdate,
            [e.target.name]: e.target.value
        })
    }
    
    //salvo l'immmagine selezionata nello stato
    const handleChangeFile = (e)=>{
        setFileSelected(e.target.files[0])
    }


    //Invio i dati aggiornati e l'avatar se presente al server
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const resp = await api.put('/auth/me', userUpdate )

            if(fileSelected){
                try {
                    const formData = new FormData()
                    formData.append("avatar", fileSelected)
                    await api.put("user/avatar", formData,{
                        headers:{
                            'Content-Type': "multipart/form-data"
                        }
                    })

                } catch (error) {
                    setMsg("Error loading image" + error.message)
                }

            }
            //aggiorno i dati nel profilo
            await fetchUser()
            setShowFormEdit(false)


        } catch (error) {
            setMsg("Something went wrong" + error.message)
            setShowMsg(true)
        }
    }


  return (
    <div className='form formEdit'>
        <div className='d-flex align-items-center justify-content-between'>
            <h5>Edit Profile</h5>
            <button className='closeForm' onClick={()=> {setShowFormEdit(false)}}>
                x
            </button>
        </div>

        <Form.Group  className='mt-2'>

        <Form.Label>Avatar </Form.Label>
        <Form.Control type="file" onChange={handleChangeFile} />

        <Form.Label>Name </Form.Label>
        <Form.Control type="text" onChange={handleChange} value={userUpdate.name} name='name'/>

        <Form.Label>Surname </Form.Label>
        <Form.Control type="text" onChange={handleChange} value={userUpdate.surname} name="surname"/>

        <Form.Label>Email </Form.Label>
        <Form.Control type="text" onChange={handleChange} value={userUpdate.email} name='email'/>

        <Form.Label>City</Form.Label>
        <Form.Control type="text" onChange={handleChange} value={userUpdate.city} name='city'/>
        
        {showMsg && (
            <p className='errorMsg'>{msg}</p>
        )}

        <Button className='btn-success mt-3' onClick={handleSubmit}>
            Edit
        </Button>
      </Form.Group>
    </div>
  )
}
