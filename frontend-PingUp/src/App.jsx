import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './component/footer/Footer';
import NavBar from './component/Nav/NavBar';
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import WelcomePage from './pages/welcome/WelcomePage';
import RegisterPage from './pages/register/RegisterPage';
import { useState } from 'react';



function App() {
    const [user, setUser] = useState(null)


  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser}/>

      <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/home' element={<HomePage setUser={setUser}/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/profile' element={<ProfilePage user={user}/>}/>
          <Route path='/profile/:id' element={<ProfilePage />}/>
      </Routes>
      

    </BrowserRouter>

  )
}

export default App
