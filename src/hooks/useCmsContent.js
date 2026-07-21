import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const _cache = new Map()

export function invalidateCmsCache(pageId) {
  for (const key of _cache.keys()) {
    if (key.startsWith(`${pageId}:`) || key.startsWith(`page:${pageId}:`)) {
      _cache.delete(key)
    }
  }
}

export function useCmsContent(pageId, sectionKey) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const cacheKey = `${pageId}:${sectionKey}:${lang}`
  const [html, setHtml] = useState(() => _cache.get(cacheKey))

  useEffect(() => {
    if (_cache.has(cacheKey)) return
    supabase
      .from('site_content')
      .select('content_html')
      .eq('page_id', pageId)
      .eq('section_key', sectionKey)
      .eq('lang', lang)
      .maybeSingle()
      .then(({ data }) => {
        const value = data?.content_html || null
        _cache.set(cacheKey, value)
        setHtml(value)
      })
  }, [cacheKey, pageId, sectionKey, lang])

  return html
}

export function useCmsPageContent(pageId) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const cacheKey = `page:${pageId}:${lang}`
  const [sections, setSections] = useState(() => _cache.get(cacheKey) || {})

  useEffect(() => {
    if (_cache.has(cacheKey)) return
    supabase
      .from('site_content')
      .select('section_key, content_html')
      .eq('page_id', pageId)
      .eq('lang', lang)
      .then(({ data }) => {
        const map = {}
        if (data) data.forEach(r => { map[r.section_key] = r.content_html })
        _cache.set(cacheKey, map)
        setSections(map)
      })
  }, [cacheKey, pageId, lang])

  return sections
}
