import { Routes, Route, Navigate } from 'react-router-dom'

// Landing page components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import VendorCTA from './components/VendorCta'
import OrderCTA from './components/OrderCta'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

// Pages — these have their OWN navbars so don't wrap with Navbar
import About from './pages/About'
import OrderNow from './pages/OrderNow'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Vendors from './pages/Vendors'
import VendorDashboard from './pages/VendorDashboard'
import PearlsCuisine from './pages/PearlsCuisine'
import AdminDashboard from './pages/AdminDashboard'
import RiderDashboard from './pages/RiderDashboard'
import SummaryDashboard from './pages/SummaryDashboard'

// ===================== PROTECTED ROUTE =====================
// DEV_MODE = true means you can see the dashboard while building
// Change to false when backend is ready
const DEV_MODE = true;

function VendorProtectedRoute({ children }) {
  const isLoggedIn = DEV_MODE ? true : false;
  if (!isLoggedIn) return <Navigate to="/vendor/login" replace />;
  return children;
}

// ===================== APP =====================
export default function App() {
  return (
    <Routes>

      {/* ===== LANDING PAGE — has Navbar ===== */}
      <Route path="/" element={
        <>
          <Navbar />
          <Hero />
          <OrderCTA />
          <HowItWorks />
          <VendorCTA />
          <FAQ />
          <Footer />
        </>
      } />

      {/* ===== ABOUT — has Navbar ===== */}
      <Route path="/about" element={
        <>
          <Navbar />
          <About />
          <Footer />
        </>
      } />

      <Route path="/vendors" element={<Vendors />} />

    
      <Route path="/order"   element={<OrderNow />} />
      <Route path="/signup"  element={<Signup />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pearls"  element={<PearlsCuisine />} />

      {/* ===== VENDOR ROUTES ===== */}
      <Route path="/vendor/login"  element={<Login />} />
      <Route path="/vendor/signup" element={<Signup />} />
      <Route path="/vendor/dashboard" element={
        <VendorProtectedRoute>
          <VendorDashboard />
        </VendorProtectedRoute>
      } />

      {/* ===== ADMIN ROUTES ===== */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/rider/dashboard" element={<RiderDashboard />} />
      <Route path="/summary/dashboard" element={<SummaryDashboard />} />

      {/* ===== CATCH ALL — redirect to home ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
