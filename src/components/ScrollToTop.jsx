import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const scrollToElement = () => {
        const element = document.getElementById(id)
        if (element) {
          const yOffset = -90 // compensation pour la hauteur de la navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        }
      }

      // Essayer immédiatement, puis après rendu complet
      scrollToElement()
      const timer1 = setTimeout(scrollToElement, 150)
      const timer2 = setTimeout(scrollToElement, 400)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop
