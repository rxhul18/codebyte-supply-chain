import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/custom/Navbar'
import SupplyChain from './pages/SupplyChain'
import RolesPage from './pages/RolesPage'
import ManufacturingPage from './pages/ManufacturingPage'
import GITagPage from './pages/GITagPage'
import ShipmentPage from './pages/ShipmentPage'

function App() {
  return (
    <div className="min-h-screen !min-w-[100%] bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/supply" element={<SupplyChain />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/gitag" element={<GITagPage />} />
          <Route path="/shipment" element={<ShipmentPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
