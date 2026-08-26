import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import FacebookPixel from './components/FacebookPixel'
import AnalyticsTracker from './components/AnalyticsTracker'

import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Programs = lazy(() => import('./pages/Programs'))
const Ebooks = lazy(() => import('./pages/Ebooks'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Admin = lazy(() => import('./pages/Admin'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ManualPayment = lazy(() => import('./pages/ManualPayment'))
const MockCheckout = lazy(() => import('./pages/MockCheckout'))
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'))
const FormationDetails = lazy(() => import('./pages/FormationDetails'))
const Track = lazy(() => import('./pages/Track'))
const SuiviMessages = lazy(() => import('./pages/SuiviMessages'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/mock-checkout') || location.pathname.startsWith('/payment-callback') || location.pathname.startsWith('/track')

  useEffect(() => {
    // Mise à jour dynamique du SEO
    const title = 'Rose Kakpo - Trading';
    const desc = 'Découvrez mon parcours et mes formations pour maîtriser le trading.';
    
    document.title = title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = desc;
  }, []);

  return (
    <div className="app-container">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: 'var(--color-white)',
            color: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-100)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            padding: '16px 24px',
            fontWeight: '600',
            fontFamily: 'var(--font-main)',
            fontSize: '1.05rem'
          },
          success: {
            iconTheme: {
              primary: 'var(--color-green-500)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-pink-500)',
              secondary: '#fff',
            },
          },
        }}
      />
      <FacebookPixel />
      <AnalyticsTracker />
      <ScrollToTop />
      {!isAdmin && !isCheckout && <AnnouncementBanner />}
      {!isAdmin && !isCheckout && <Navbar />}
      <main className={`main-content ${isCheckout ? 'no-padding' : ''}`}>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#666', fontSize: '1.2rem' }}>Chargement...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/formation/:slug" element={<FormationDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/manual-payment" element={<ManualPayment />} />
            <Route path="/mock-checkout" element={<MockCheckout />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />
            <Route path="/track/:trackingId" element={<Track />} />
            <Route path="/suivi" element={<SuiviMessages />} />
            <Route path="/temoignages" element={<TestimonialsPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && !isCheckout && <Footer />}
    </div>
  )
}

export default App
