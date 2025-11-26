import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Greeting from './Greeting'
import "./index.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Greeting />} />
    </Routes>
  )
}
