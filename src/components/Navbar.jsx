import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/about' },
    { name: 'Formations', path: '/programs' },
    { name: 'Ebooks', path: '/ebooks' },
    { name: 'Blog', path: '/blog' },
    { name: 'Témoignages', path: '/temoignages' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          {/* Remplacement du texte par le logo */}
          <img src="/logo.png" alt="Rose Kakpo Logo" className="logo-img" />
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          {navLinks.map((link, index) => (
            <li className="nav-item" key={index}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? 'nav-links active' : 'nav-links'}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="nav-item nav-btn-item">
            <Link to="/programs" className="btn btn-primary" onClick={closeMenu}>
              Commencer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
