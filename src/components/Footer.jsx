import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const links = {
    products: [
      { key: 'navbar.aps_name',  href: '/products/aps' },
      { key: 'navbar.esg_name',  href: '/products/esg' },
      { key: 'navbar.aibox_name', href: '/products/ai-box' },
    ],
    company: [
      { key: 'footer.about_link',   href: '/about' },
      { key: 'footer.cases_link',   href: '#' },
      { key: 'footer.news_link',    href: '#' },
      { key: 'footer.contact_link', href: '/contact' },
    ],
    resources: [
      { key: 'footer.docs_link',       href: '#' },
      { key: 'footer.whitepaper_link', href: '#' },
      { key: 'footer.faq_link',        href: '#' },
    ],
  }

  return (
    <footer id="about" className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="CRIS Logo" className="h-9 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.brand_desc')}
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.products_title')}</h4>
            <ul className="space-y-3">
              {links.products.map((l) => (
                <li key={l.key}>
                  <Link to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.company_title')}</h4>
            <ul className="space-y-3">
              {links.company.map((l) => (
                <li key={l.key}>
                  {l.href.startsWith('/') ? (
                    <Link to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {t(l.key)}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {t(l.key)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.resources_title')}</h4>
            <ul className="space-y-3">
              {links.resources.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
