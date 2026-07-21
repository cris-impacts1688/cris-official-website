import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Tag, Newspaper } from 'lucide-react'
import { supabase } from '../lib/supabase'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function NewsPost() {
  const { id } = useParams()
  const [post, setPost]     = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    async function fetch() {
      setStatus('loading')
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) {
        setStatus('error')
      } else {
        setPost(data)
        setStatus('ok')
      }
    }
    fetch()
  }, [id])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cris-blue dark:hover:text-cris-blue-light transition-colors mb-10">
          <ArrowLeft size={16} /> 返回首頁
        </Link>

        {status === 'loading' && (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-8" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-24 text-slate-400 dark:text-slate-500">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" strokeWidth={1.2} />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">找不到這篇文章</p>
            <p className="text-sm mt-2">文章可能已被刪除或連結有誤。</p>
          </div>
        )}

        {status === 'ok' && post && (
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {post.category && (
                <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-cris-blue/10 text-cris-blue dark:bg-cris-blue/20 dark:text-cris-blue-light">
                  <Tag size={11} /> {post.category}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Clock size={12} />
                {formatDate(post.published_at || post.created_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
              {post.title || '（無標題）'}
            </h1>

            {/* Cover image */}
            {post.image_url && (
              <div className="rounded-2xl overflow-hidden mb-10 bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full object-contain"
                />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed border-l-4 border-cris-blue pl-5 mb-10">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            {post.content ? (
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 italic">（此文章尚無全文內容）</p>
            )}

          </motion.article>
        )}
      </div>
    </div>
  )
}
