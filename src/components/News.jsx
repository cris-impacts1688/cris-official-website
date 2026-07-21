import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Newspaper, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

// Change this to match your Supabase table name
const TABLE = 'posts'
const PAGE_SIZE = 6

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100 dark:bg-slate-700" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded-full" />
        <div className="h-5 w-full bg-slate-100 dark:bg-slate-700 rounded-lg" />
        <div className="h-5 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-lg" />
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full" />
        <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-700 rounded-full" />
      </div>
    </div>
  )
}

function NewsCard({ article, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useTranslation()

  const title    = article.title || article.name || '（無標題）'
  const excerpt  = article.excerpt || article.summary || article.description || article.content?.slice(0, 120) || ''
  const category = article.category || article.type || article.tag || ''
  const date     = article.published_at || article.created_at || ''
  const imageUrl = article.image_url || article.cover || article.thumbnail || null
  const slug     = article.slug || article.id

  const categoryColors = [
    'bg-cris-blue/10 text-cris-blue dark:bg-cris-blue/20 dark:text-cris-blue-light',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ]
  const colorClass = categoryColors[index % categoryColors.length]

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={`/news/${slug}`} className="block h-full">
      {/* Cover image */}
      {imageUrl ? (
        <div className="h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
          <Newspaper size={36} className="text-slate-300 dark:text-slate-600" strokeWidth={1.2} />
        </div>
      )}

      <div className="p-6">
        {/* Category + date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {category && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
              {category}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 ml-auto">
              <Clock size={12} />
              {formatDate(date)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-cris-blue dark:group-hover:text-cris-blue-light transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Read more */}
        <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-cris-blue dark:text-cris-blue-light group-hover:gap-2 transition-all">
          {t('news_section.read_more')}
          <ArrowRight size={14} />
        </div>
      </div>
      </Link>
    </motion.article>
  )
}

export default function News() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()

  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error | empty

  useEffect(() => {
    let cancelled = false

    async function fetchNews() {
      setStatus('loading')
      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(PAGE_SIZE)

        if (cancelled) return
        if (error) throw error
        if (!data || data.length === 0) {
          setStatus('empty')
        } else {
          setArticles(data)
          setStatus('ok')
        }
      } catch (err) {
        if (!cancelled) setStatus('error')
        console.error('[News] Supabase fetch error:', err)
      }
    }

    fetchNews()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('news_section.tag')}
          </span>
          <h2 className="section-title mt-3">{t('news_section.title')}</h2>
          <p className="section-subtitle">{t('news_section.subtitle')}</p>
        </motion.div>

        {/* Loading skeletons */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" strokeWidth={1.2} />
            <p>{t('news_section.error')}</p>
          </div>
        )}

        {/* Empty state */}
        {status === 'empty' && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" strokeWidth={1.2} />
            <p>{t('news_section.empty')}</p>
          </div>
        )}

        {/* Articles grid */}
        {status === 'ok' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <button className="btn-outline">
                {t('news_section.view_all')}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
