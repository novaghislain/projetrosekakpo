import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Ebooks from './pages/Ebooks'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import ManualPayment from './pages/ManualPayment'
import MockCheckout from './pages/MockCheckout'
import PaymentCallback from './pages/PaymentCallback'
import FormationDetails from './pages/FormationDetails'
import { useContent } from './hooks/useContent'

function App() {
  const location = useLocation()
  const { c } = useContent()
  const isAdmin = location.pathname.startsWith('/admin')
  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/mock-checkout') || location.pathname.startsWith('/payment-callback')

  useEffect(() => {
    // Mise à jour dynamique du SEO
    const title = c('seo_title', 'Rose Kakpo - Trading');
    const desc = c('seo_description', 'Découvrez mon parcours et mes formations pour maîtriser le trading.');
    
    document.title = title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = desc;
  }, [c]);

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdmin && !isCheckout && <AnnouncementBanner />}
      {!isAdmin && !isCheckout && <Navbar />}
      <main className={`main-content ${isCheckout ? 'no-padding' : ''}`}>
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
        </Routes>
      </main>
      {!isAdmin && !isCheckout && <Footer />}
    </div>
  )
}

export default App
