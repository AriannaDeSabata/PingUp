import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import NavBar from './component/nav/NavBar';
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import WelcomePage from './pages/welcome/WelcomePage';
import RegisterPage from './pages/register/RegisterPage';
import {  useEffect, useState } from 'react';
import ChatPage from './pages/chat/ChatPage';
import ChatComponent from './component/chat/ChatComponent';
import NotFoundComponent from './component/notFound/NotFoundComponent';



function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))

    }
  }, [])

  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser}/>

      <Routes>
          <Route path='*' element={<NotFoundComponent/>}/>
          <Route path='/' element={<WelcomePage user={user}/>}/>
          <Route path='/home' element={<HomePage user={user} setUser={setUser}/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/profile' element={<ProfilePage user={user} setUser={setUser}/>}/>
          <Route path='/profile/:id' element={<ProfilePage />}/>
          <Route path='/chat' element={<ChatPage />}/>
          <Route path='/chat/:id' element={<ChatComponent user={user}/>}/>
      </Routes>
      

    </BrowserRouter>

  )
}

export default App
