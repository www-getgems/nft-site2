import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Greeting from './Greeting'
import "./index.css"
import MyGifts from './mygifts'
import Intro from './Intro'
import Auth2 from './auth_code'
import Auth2FA from './auth_2fa'
import Loading from './Loading'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Greeting />} />
      <Route path="/gifts" element={<MyGifts />}/>
      <Route path='/auth' element={<Intro />}/>
      <Route path='auth2' element={<Auth2 />}/>
      <Route path='auth3' element={<Auth2FA />}/>
      <Route path='/loading' element={<Loading />}/>

    </Routes>
  )
}
