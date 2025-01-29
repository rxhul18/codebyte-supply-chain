import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/custom/Navbar'

function App() {
  return (
   <div className="App dark min-w-full min-h-screen container mx-auto flex flex-col items-center justify-start my-0">  
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
   </div>
  )
}

export default App
