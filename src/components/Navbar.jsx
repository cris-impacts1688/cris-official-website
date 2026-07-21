import { useState, useEffect } from 'react'
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ctaStyle = {
  '/products/aps':    'bg-cris-blue hover:bg-cris-blue-dark shadow-cris-blue/20',
  '/products/esg':    'bg-green-600 hover:bg-green-700 shadow-green-600/20',
  '/products/ai-box': 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
}

const LANGS = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en',    label: 'EN'   },
]

function LangSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language

  function changeLang(code) {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
  }

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
            current === l.code
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export default function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const btnColor = ctaStyle[pathname] ?? 'bg-cris-blue hover:bg-cris-blue-dark shadow-cris-blue/20'

  const products = [
    { name: t('navbar.aps_name'), desc: t('navbar.aps_desc'), href: '/products/aps' },
    { name: t('navbar.esg_name'), desc: t('navbar.esg_desc'), href: '/products/esg' },
    { name: t('navbar.aibox_name'), desc: t('navbar.aibox_desc'), href: '/products/ai-box' },
    { name: t('navbar.mc_name'), desc: t('navbar.mc_desc'), href: '/products/mission-control' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="CRIS Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-cris-blue dark:hover:text-cris-blue-light font-medium transition-colors">
            {t('navbar.home')}
          </Link>

          {/* Products Dropdown */}
          <div className="relative" onMouseEnter={() => setProductOpen(true)} onMouseLeave={() => setProductOpen(false)}>
            <button className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-cris-blue dark:hover:text-cris-blue-light font-medium transition-colors">
              {t('navbar.products')} <ChevronDown size={16} className={`transition-transform ${productOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {productOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2"
                >
                  {products.map((p) => (
                    <Link
                      key={p.href}
                      to={p.href}
                      className="flex flex-col px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setProductOpen(false)}
                    >
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/solutions" className="text-slate-600 dark:text-slate-300 hover:text-cris-blue dark:hover:text-cris-blue-light font-medium transition-colors">
            {t('navbar.solutions')}
          </Link>
          <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-cris-blue dark:hover:text-cris-blue-light font-medium transition-colors">
            {t('navbar.about')}
          </Link>
          <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-cris-blue dark:hover:text-cris-blue-light font-medium transition-colors">
            {t('navbar.contact')}
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LangSwitcher />
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/contact" className={`hidden md:inline-flex items-center gap-1.5 text-sm py-2 px-4 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${btnColor}`}>
            {t('navbar.consultation')}
          </Link>

          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link to="/" className="font-medium text-slate-700 dark:text-slate-300" onClick={() => setMenuOpen(false)}>{t('navbar.home')}</Link>
              <div className="pl-4 border-l-2 border-cris-blue flex flex-col gap-2">
                {products.map((p) => (
                  <Link key={p.href} to={p.href} className="text-sm text-slate-600 dark:text-slate-400" onClick={() => setMenuOpen(false)}>
                    {p.name}
                  </Link>
                ))}
              </div>
              <Link to="/solutions" className="font-medium text-slate-700 dark:text-slate-300" onClick={() => setMenuOpen(false)}>{t('navbar.solutions')}</Link>
              <Link to="/about" className="font-medium text-slate-700 dark:text-slate-300" onClick={() => setMenuOpen(false)}>{t('navbar.about')}</Link>
              <Link to="/contact" className="font-medium text-slate-700 dark:text-slate-300" onClick={() => setMenuOpen(false)}>{t('navbar.contact')}</Link>
              <div className="pt-1">
                <LangSwitcher />
              </div>
              <Link to="/contact" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>{t('navbar.consultation')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
