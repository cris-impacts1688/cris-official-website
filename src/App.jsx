import { useState, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Features from './components/Features'
import News from './components/News'
import Cases from './components/Cases'
import Contact from './components/Contact'
import APSProduct from './pages/APSProduct'
import About from './pages/About'
import ESGProduct from './pages/ESGProduct'
import AIBoxProduct from './pages/AIBoxProduct'
import ContactPage from './pages/ContactPage'
import Admin from './pages/Admin'
import DesignSystem from './pages/DesignSystem'
import NewsPost from './pages/NewsPost'
import Solutions from './pages/Solutions'
import MissionControl from './pages/MissionControl'
import AISolutions from './components/AISolutions'

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <AISolutions />
      <News />
      <Cases />
      <Contact />
    </>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        {/* Admin — no Navbar/Footer */}
        <Route path="/admin" element={<Admin />} />

        {/* Design System — internal only, no Navbar/Footer */}
        <Route path="/design-system" element={<DesignSystem />} />

        {/* Public site */}
        <Route path="*" element={
          <div className="min-h-screen">
            <Navbar dark={dark} setDark={setDark} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/aps" element={<APSProduct />} />
              <Route path="/about" element={<About />} />
              <Route path="/products/esg" element={<ESGProduct />} />
              <Route path="/products/ai-box" element={<AIBoxProduct />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/news/:id" element={<NewsPost />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/products/mission-control" element={<MissionControl />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
