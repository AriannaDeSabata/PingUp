import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './component/Footer';
import NavBar from './component/Nav/NavBar';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import {  useState } from 'react';

import RegisterPage from './pages/register/RegisterPage';


function App() {
    const [user, setUser] = useState(null)


  return (
    <BrowserRouter>
      <NavBar/>

      <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/home' element={<HomePage setUser={setUser}/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/profile' element={<ProfilePage user={user}/>}/>
      </Routes>
      

    </BrowserRouter>

  )
}

export default App
