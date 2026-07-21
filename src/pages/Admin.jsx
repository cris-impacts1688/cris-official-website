import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Plus, Edit2, Trash2, ArrowLeft, Save,
  Eye, EyeOff, ImageIcon, AlertCircle, CheckCircle2, ChevronRight,
  Mail, Newspaper, LayoutTemplate, Star, Users,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import ContentManagerView from './AdminContent'
import AdminCasesView from './AdminCases'
import AdminUsersView from './AdminUsers'

const TABLE = 'posts'
const BUCKET = 'media'

const CATEGORIES = ['公司動態', '產品更新', '產業觀察', '客戶案例', '技術分享', '活動資訊']
const AI_TAGS = ['AI Agent', 'RAG', 'On-Premise', '預測性維護', '智能財務', '智能售服', 'AIoT', 'Argox AI', 'AI 一體機', '數據主權']

// ─── Shared input style ───────────────────────────────────────────────────────
const inp = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/40 focus:border-cris-blue text-sm transition-colors'

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginView() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="CRIS" className="h-10 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900">後台管理系統</h1>
          <p className="text-sm text-slate-500 mt-1">請使用管理員帳號登入</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@company.com" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">密碼</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={pw} onChange={e => setPw(e.target.value)}
                placeholder="••••••••" className={`${inp} pr-10`} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-cris-blue hover:bg-cris-blue-dark text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-400">
          <Link to="/" className="hover:text-cris-blue transition-colors">← 返回官網</Link>
        </p>
      </div>
    </div>
  )
}

// ─── Toast helper ─────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Admin Header ─────────────────────────────────────────────────────────────
function AdminHeader({ session, crumb, section, onSection }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="CRIS" className="h-7 w-auto" />
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-700">{crumb || '後台管理'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-slate-400 max-w-[140px] truncate">{session?.user?.email}</span>
            <Link to="/" className="text-xs text-slate-500 hover:text-cris-blue transition-colors">官網</Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors">
              <LogOut size={13} /> 登出
            </button>
          </div>
        </div>

        {section && onSection && (
          <div className="flex gap-1 -mx-6 px-6 border-t border-slate-100">
            <button
              onClick={() => onSection('posts')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                section === 'posts'
                  ? 'border-cris-blue text-cris-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Newspaper size={14} /> 消息管理
            </button>
            <button
              onClick={() => onSection('contacts')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                section === 'contacts'
                  ? 'border-cris-blue text-cris-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail size={14} /> 聯絡紀錄
            </button>
            <button
              onClick={() => onSection('content')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                section === 'content'
                  ? 'border-cris-blue text-cris-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutTemplate size={14} /> 內容管理
            </button>
            <button
              onClick={() => onSection('cases')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                section === 'cases'
                  ? 'border-cris-blue text-cris-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Star size={14} /> 成功案例
            </button>
            <button
              onClick={() => onSection('users')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                section === 'users'
                  ? 'border-cris-blue text-cris-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users size={14} /> 帳號管理
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// ─── Posts list ───────────────────────────────────────────────────────────────
function PostsView({ session, onNew, onEdit, onSection }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
    if (error) showToast('載入失敗：' + error.message, 'error')
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirmDelete() {
    const { error } = await supabase.from(TABLE).delete().eq('id', deleteId)
    if (error) {
      showToast('刪除失敗：' + error.message, 'error')
    } else {
      showToast('已刪除文章')
      setPosts(prev => prev.filter(p => p.id !== deleteId))
    }
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} section="posts" onSection={onSection} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">消息列表</h1>
            <p className="text-sm text-slate-500 mt-0.5">共 {posts.length} 篇</p>
          </div>
          <button onClick={onNew}
            className="flex items-center gap-2 bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
            <Plus size={16} /> 新增文章
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">還沒有文章，點「新增文章」開始新增。</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">標題</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">分類</th>
                  <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">時間</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map(post => (
                  <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 truncate max-w-[260px]">{post.title || '（無標題）'}</div>
                      {post.excerpt && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{post.excerpt}</div>}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4">
                      {post.category
                        ? <span className="text-xs px-2.5 py-1 rounded-full bg-cris-blue/10 text-cris-blue font-semibold">{post.category}</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onEdit(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cris-blue hover:bg-cris-blue/10 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(post.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">確認刪除</h3>
                  <p className="text-sm text-slate-500">此操作無法復原。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  取消
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                  確認刪除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Contacts list ───────────────────────────────────────────────────────────
function ContactsView({ session, onSection }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [toast, setToast]       = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_forms')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) showToast('載入失敗：' + error.message, 'error')
    setContacts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirmDelete() {
    const { error } = await supabase.from('contact_forms').delete().eq('id', deleteId)
    if (error) {
      showToast('刪除失敗：' + error.message, 'error')
    } else {
      showToast('已刪除')
      setContacts(prev => prev.filter(c => c.id !== deleteId))
    }
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} section="contacts" onSection={onSection} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">聯絡紀錄</h1>
          <p className="text-sm text-slate-500 mt-0.5">共 {contacts.length} 筆</p>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">目前還沒有聯絡表單填寫紀錄。</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">姓名 / 公司</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">聯絡方式</th>
                  <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">送出時間</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contacts.map(c => (
                  <>
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{c.company}</div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4">
                        <div className="text-slate-700 text-xs">{c.email}</div>
                        {c.phone && <div className="text-slate-400 text-xs mt-0.5">{c.phone}</div>}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <button onClick={e => { e.stopPropagation(); setDeleteId(c.id) }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    {expanded === c.id && (
                      <tr key={c.id + '-msg'}>
                        <td colSpan={4} className="px-6 pb-4 pt-0">
                          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed">
                            {c.message ? c.message : <span className="text-slate-400 italic">（未填寫訊息）</span>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">確認刪除</h3>
                  <p className="text-sm text-slate-500">此操作無法復原。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  取消
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                  確認刪除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Post form (create / edit) ────────────────────────────────────────────────
const EMPTY = { title: '', category: '', excerpt: '', content: '', image_url: '', published_at: '', ai_tags: [] }

function PostForm({ post, session, onBack, onSaved }) {
  const isEdit = !!post
  const [form, setForm] = useState(isEdit ? {
    title:        post.title        || '',
    category:     post.category     || '',
    excerpt:      post.excerpt      || '',
    content:      post.content      || '',
    image_url:    post.image_url    || '',
    published_at: post.published_at ? post.published_at.slice(0, 16) : '',
    ai_tags:      post.ai_tags      || [],
  } : { ...EMPTY })
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const [toast, setToast]       = useState(null)

  function set(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `news/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (upErr) {
      setError('圖片上傳失敗：' + upErr.message)
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setForm(f => ({ ...f, image_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : new Date().toISOString(),
    }
    const { error: err } = isEdit
      ? await supabase.from(TABLE).update(payload).eq('id', post.id)
      : await supabase.from(TABLE).insert([payload])
    setSaving(false)
    if (err) { setError(err.message) } else { onSaved() }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} crumb={isEdit ? '編輯文章' : '新增文章'} />

      <form onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-8 space-y-5 pb-16">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">基本資訊</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">標題 <span className="text-red-500">*</span></label>
            <input name="title" required value={form.title} onChange={set} placeholder="文章標題" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">分類</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(f => ({ ...f, category: f.category === c ? '' : c }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    form.category === c
                      ? 'bg-cris-blue text-white shadow-sm shadow-cris-blue/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>{c}</button>
              ))}
            </div>
            <input name="category" value={form.category} onChange={set}
              placeholder="或自行輸入分類名稱..." className={inp} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">AI 技術標籤</label>
            <div className="flex flex-wrap gap-2">
              {AI_TAGS.map(tag => {
                const active = form.ai_tags.includes(tag)
                return (
                  <button key={tag} type="button"
                    onClick={() => setForm(f => ({
                      ...f,
                      ai_tags: active ? f.ai_tags.filter(t => t !== tag) : [...f.ai_tags, tag]
                    }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>{tag}</button>
                )
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">可複選多個 AI 技術標籤</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">發布時間</label>
            <input type="datetime-local" name="published_at" value={form.published_at} onChange={set} className={inp} />
            <p className="text-xs text-slate-400 mt-1">留空則以當下時間發布</p>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">封面圖片</h2>
          <input name="image_url" value={form.image_url} onChange={set}
            placeholder="貼上圖片網址 https://..." className={inp} />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" /><span className="text-xs text-slate-400">或上傳檔案</span><div className="h-px flex-1 bg-slate-100" />
          </div>
          <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-500 cursor-pointer hover:border-cris-blue/50 hover:text-cris-blue transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImageIcon size={15} />
            {uploading ? '上傳中...' : '從電腦選取圖片'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {form.image_url && (
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img src={form.image_url} alt="預覽" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">文章內容</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">摘要 <span className="text-slate-400 font-normal text-xs">（顯示在卡片上）</span></label>
            <textarea name="excerpt" value={form.excerpt} onChange={set} rows={3}
              placeholder="50–100 字的簡短摘要..."
              className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">全文內容</label>
            <textarea name="content" value={form.content} onChange={set} rows={14}
              placeholder="在此輸入文章全文..."
              className={`${inp} resize-none font-mono leading-relaxed`} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={15} /> 返回
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
            <Save size={16} />
            {saving ? '儲存中...' : isEdit ? '更新文章' : '發布文章'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [section, setSection] = useState('posts')
  const [view, setView]       = useState('list')
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Loading
  if (session === undefined) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cris-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Not logged in
  if (!session) return <LoginView />

  // Post form views
  if (view === 'new')
    return <PostForm post={null} session={session} onBack={() => setView('list')} onSaved={() => setView('list')} />
  if (view === 'edit')
    return <PostForm post={editing} session={session} onBack={() => setView('list')} onSaved={() => setView('list')} />

  // Contacts section
  if (section === 'contacts')
    return <ContactsView session={session} onSection={s => { setSection(s); setView('list') }} />

  // Cases section
  if (section === 'cases')
    return (
      <AdminCasesView
        session={session}
        AdminHeader={AdminHeader}
        onSection={s => { setSection(s); setView('list') }}
      />
    )

  // Content manager section
  if (section === 'content')
    return (
      <ContentManagerView
        session={session}
        AdminHeader={AdminHeader}
        onSection={s => { setSection(s); setView('list') }}
      />
    )

  // Users section
  if (section === 'users')
    return (
      <AdminUsersView
        session={session}
        AdminHeader={AdminHeader}
        onSection={s => { setSection(s); setView('list') }}
      />
    )

  return (
    <PostsView
      session={session}
      onNew={() => setView('new')}
      onEdit={post => { setEditing(post); setView('edit') }}
      onSection={s => { setSection(s); setView('list') }}
    />
  )
}
