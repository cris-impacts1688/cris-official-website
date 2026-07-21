import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'

const EJS_SERVICE  = 'service_f1yvsnm'
const EJS_TEMPLATE = 'template_aop47zn'
const EJS_KEY      = 'eJq0ZLip4618kLRLb'

const contactInfoIcons = [MapPin, Phone, Mail]
const contactInfoValues = [
  '臺中市西屯區市政北七路186號22樓之5',
  '(04) 2254-2912',
  'cris@impacts.cloud',
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const { t } = useTranslation()

  const contactLabels = [t('contact.address_label'), t('contact.phone_label'), t('contact.email_label')]

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
      message: form.message || null,
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
      message:   form.message || '-',
    }, EJS_KEY)

    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('contact.tag')}
          </span>
          <h2 className="section-title mt-3">{t('contact.title')}</h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col justify-between"
          >
            <div>
              <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="CRIS Logo" className="h-10 w-auto object-contain mb-6 mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">快思股份有限公司</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                專注於工業 4.0 智慧製造解決方案，協助製造業實現生產效率最大化與永續目標達成。
              </p>
            </div>

            <div className="mt-10 space-y-5">
              {contactInfoIcons.map((Icon, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cris-blue/10 dark:bg-cris-blue/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-cris-blue dark:text-cris-blue-light" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{contactLabels[i]}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{contactInfoValues[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <CheckCircle size={56} className="text-emerald-500 mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('contact.success_title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-3">{t('contact.success_desc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('contact.name_placeholder')}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.company')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={form.company}
                      onChange={handleChange}
                      placeholder={t('contact.company_placeholder')}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('contact.email_placeholder')}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t('contact.phone_placeholder')}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('contact.message')}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t('contact.message_placeholder')}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/50 focus:border-cris-blue transition-colors text-sm resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-red-500 text-center">{submitError}</p>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
                  <Send size={18} /> {submitting ? '送出中...' : t('contact.submit')}
                </button>

                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  {t('contact.privacy')}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
