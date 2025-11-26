import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Greeting from './Greeting'
import "./index.css"
import MyGifts from './mygifts'
import Intro from './Intro'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Greeting />} />
      <Route path="/gifts" element={<MyGifts />}/>
      <Route path='/auth' element={<Intro />}/>
    </Routes>
  )
}
