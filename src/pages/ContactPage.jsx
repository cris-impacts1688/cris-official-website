import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Send, MapPin, Phone, Mail, CheckCircle,
  Clock, Users, Award, Calendar, BarChart3, Cpu,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'

const EJS_SERVICE  = 'service_f1yvsnm'
const EJS_TEMPLATE = 'template_aop47zn'
const EJS_KEY      = 'eJq0ZLip4618kLRLb'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { t } = useTranslation()
  const formRef   = useRef(null)
  const formInView = useInView(formRef, { once: true, margin: '-60px' })
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', product: '', message: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    const { error } = await supabase.from('contact_forms').insert([{
      name:    form.name,
      company: form.company || null,
      email:   form.email,
      phone:   form.phone   || null,
      message: [form.product ? `產品：${form.product}` : '', form.message].filter(Boolean).join('\n') || null,
    }])

    if (error) {
      setSubmitting(false)
      setSubmitError('送出失敗，請稍後再試。')
      return
    }

    await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
      from_name: form.name,
      company:   form.company || '-',
      reply_to:  form.email,
      phone:     form.phone || '-',
      message:   [form.product ? `產品：${form.product}` : '', form.message].filter(Boolean).join('\n') || '-',
    }, EJS_KEY)

    setSubmitting(false)
    setSubmitted(true)
  }

  const contactInfo = [
    { icon: MapPin, label: t('contact.address_label'), value: '臺中市西屯區市政北七路186號22樓之5' },
    { icon: Phone,  label: t('contact.phone_label'),   value: '(04) 2254-2912' },
    { icon: Mail,   label: t('contact.email_label'),   value: 'cris@impacts.cloud' },
  ]

  const trustBadges = [
    { icon: Clock,  title: t('contact_page.trust_0_title'), desc: t('contact_page.trust_0_desc') },
    { icon: Users,  title: t('contact_page.trust_1_title'), desc: t('contact_page.trust_1_desc') },
    { icon: Award,  title: t('contact_page.trust_2_title'), desc: t('contact_page.trust_2_desc') },
  ]

  const products = [
    { icon: Calendar,  value: 'aps',   label: t('contact_page.product_aps'),   color: 'text-cris-blue' },
    { icon: BarChart3, value: 'esg',   label: t('contact_page.product_esg'),   color: 'text-emerald-600' },
    { icon: Cpu,       value: 'aibox', label: t('contact_page.product_aibox'), color: 'text-violet-600' },
    { icon: null,      value: 'all',   label: t('contact_page.product_all'),   color: 'text-slate-600' },
  ]

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16
        bg-gradient-to-br from-blue-50 via-white to-slate-100
        dark:bg-none dark:[background:linear-gradient(135deg,#0f172a_0%,#0a0f1e_60%,#000_100%)]">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.10]"
          style={{ backgroundImage: 'radial-gradient(circle, #0052D9 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* Light blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none dark:opacity-0" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cris-blue/10 rounded-full blur-3xl opacity-40 pointer-events-none dark:opacity-0" />

        {/* Dark glow */}
        <div className="absolute top-0 right-0 w-[440px] h-[440px] bg-cris-blue/[0.07] rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100" />

        {/* Gear micro-icons */}
        {[
          { left: '4%',  top: '22%', size: 20, delay: 0,   dur: 12 },
          { left: '93%', top: '18%', size: 16, delay: 1.4, dur: 15 },
          { left: '89%', top: '70%', size: 14, delay: 0.7, dur: 10 },
          { left: '2%',  top: '78%', size: 18, delay: 2.0, dur: 13 },
        ].map((g, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-[0.18] dark:opacity-[0.12]"
            style={{ left: g.left, top: g.top }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: 'linear' }}
          >
            <svg width={g.size} height={g.size} viewBox="0 0 24 24" fill="none" stroke="#0052D9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </motion.div>
        ))}

        {/* Tech accent lines */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden opacity-[0.15] dark:opacity-[0.10]">
          <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
            <line x1="256" y1="0"  x2="0"   y2="256" stroke="#0052D9" strokeWidth="0.8" />
            <line x1="256" y1="48" x2="48"  y2="256" stroke="#0052D9" strokeWidth="0.5" />
            <line x1="256" y1="96" x2="96"  y2="256" stroke="#0052D9" strokeWidth="0.5" />
            <circle cx="220" cy="36" r="2.5" fill="#0052D9" opacity="0.8" />
            <circle cx="180" cy="76" r="1.8" fill="#0052D9" opacity="0.55" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-12"
          >
            <Link to="/" className="hover:text-cris-blue dark:hover:text-cris-blue-light transition-colors text-slate-500 dark:text-slate-500">{t('navbar.home')}</Link>
            <span>/</span>
            <span className="text-cris-blue dark:text-cris-blue-light">{t('contact_page.breadcrumb')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
              bg-blue-100 border border-blue-200 text-cris-blue
              dark:bg-white/5 dark:border-white/10 dark:text-cris-blue-light">
              <span className="w-1.5 h-1.5 rounded-full bg-cris-blue dark:bg-cris-blue-light animate-pulse" />
              <span className="text-xs font-medium tracking-wide">{t('contact_page.badge')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
              <span className="text-slate-900 dark:text-white">{t('contact_page.title_prefix')}</span>
              <br />
              <span className="text-gradient-anim">{t('contact_page.title_gradient')}</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {t('contact_page.subtitle')}
            </p>
          </motion.div>

          {/* Contact chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3 pb-20"
          >
            {contactInfo.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                  bg-white/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10
                  backdrop-blur-sm shadow-sm">
                  <Icon size={14} className="text-cris-blue dark:text-cris-blue-light flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.value}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left: Info + Trust */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-10"
            >
              <div>
                <img
                  src={import.meta.env.BASE_URL + 'Logo_CRIS.png'}
                  alt="CRIS Logo"
                  className="h-10 w-auto object-contain mb-5 mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
                />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('contact_page.company_name')}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                  {t('contact_page.company_desc')}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cris-blue/10 dark:bg-cris-blue/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-cris-blue dark:text-cris-blue-light" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{item.label}</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('contact_page.promise_title')}</h4>
                {trustBadges.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <motion.div
                      key={b.title}
                      initial={{ opacity: 0, x: -16 }}
                      animate={formInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-800/50">
                        <Icon size={15} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{b.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{b.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Right: Form card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-8 lg:p-10">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <CheckCircle size={60} className="text-emerald-500 mx-auto mb-5" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('contact_page.success_title')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-sm">
                      {t('contact_page.success_desc')}
                    </p>
                    <Link to="/" className="mt-8 btn-outline text-sm">{t('contact_page.back_home')}</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('contact_page.form_title')}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        標有 <span className="text-red-500">*</span> {t('contact_page.required_note')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('contact.name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text" name="name" required
                          value={form.name} onChange={handleChange}
                          placeholder={t('contact.name_placeholder')}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600
                            bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400
                            focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('contact.company')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text" name="company" required
                          value={form.company} onChange={handleChange}
                          placeholder={t('contact.company_placeholder')}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600
                            bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400
                            focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('contact.email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email" name="email" required
                          value={form.email} onChange={handleChange}
                          placeholder={t('contact.email_placeholder')}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600
                            bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400
                            focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.phone')}</label>
                        <input
                          type="tel" name="phone"
                          value={form.phone} onChange={handleChange}
                          placeholder={t('contact.phone_placeholder')}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600
                            bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400
                            focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact_page.product_label')}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {products.map((p) => {
                          const Icon = p.icon
                          const selected = form.product === p.value
                          return (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => setForm({ ...form, product: p.value })}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 text-xs font-medium
                                ${selected
                                  ? 'bg-cris-blue/10 border-cris-blue/50 text-cris-blue dark:bg-cris-blue/20 dark:border-cris-blue/60 dark:text-cris-blue-light'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                              {Icon && <Icon size={16} className={selected ? 'text-cris-blue dark:text-cris-blue-light' : 'text-slate-400'} strokeWidth={1.5} />}
                              {p.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.message')}</label>
                      <textarea
                        name="message"
                        value={form.message} onChange={handleChange}
                        rows={4}
                        placeholder={t('contact.message_placeholder')}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600
                          bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400
                          focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm resize-none"
                      />
                    </div>

                    {submitError && (
                      <p className="text-sm text-red-500 text-center">{submitError}</p>
                    )}

                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                      <Send size={18} /> {submitting ? '送出中…' : t('contact.submit')}
                    </button>

                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                      {t('contact.privacy')}
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}
