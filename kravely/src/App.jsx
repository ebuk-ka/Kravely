import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import About from './pages/About'
import VendorCTA from './components/VendorCta'
import OrderCTA from './components/OrderCta'
import Footer from './components/Footer'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            < OrderCTA />
            <HowItWorks />
            <VendorCTA />
            <Footer />
          </>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}