import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import About from './pages/About'
import Menu from './pages/Menu'
import VendorCTA from './components/VendorCta'
import OrderCTA from './components/OrderCta'
import Footer from './components/Footer'
import OrderNow from "./pages/OrderNow";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

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
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderNow />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}