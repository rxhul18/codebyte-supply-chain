import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/custom/Navbar'

function App() {

  return (
   <div className="App w-full min-h-full container mx-auto justify-center ">  
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
   </div>
  )
}

export default App
