import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './component/Footer';
import NavBar from './component/Nav/NavBar';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import { useEffect, useState } from 'react';
import api from '../service/api'
import RegisterPage from './pages/register/RegisterPage';


function App() {
    const [user, setUser] = useState(null)


    const getMe = async(token)=>{
      try {
        const resUser = await api.get('/auth/me',{
          headers:{
            Authorization: `Bearer ${token}`
          }

        })
          console.log(resUser.data)
          setUser(resUser.data)

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
    <BrowserRouter>
      <NavBar/>

      <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/home' element={<HomePage user={user}/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/profile' element={<ProfilePage user={user}/>}/>
      </Routes>
      
      <Footer/>
    </BrowserRouter>

  )
}

export default App
