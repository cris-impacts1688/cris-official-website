import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, ArrowLeft, Save,
  AlertCircle, CheckCircle2, GripVertical,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ICON_MAP, CATEGORIES } from '../constants/cases'

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_NAMES = Object.keys(ICON_MAP)

const CATEGORY_OPTIONS = [
  { key: 'finance',       label: '金融科技' },
  { key: 'support',       label: '客服支援' },
  { key: 'manufacturing', label: '智慧製造' },
  { key: 'green',         label: '綠色永續' },
  { key: 'special',       label: '特殊應用' },
]

const LANG_TABS = [
  { code: 'tw', label: '繁中' },
  { code: 'cn', label: '简中' },
  { code: 'en', label: 'EN'   },
]

const EMPTY = {
  category: 'finance', icon_name: 'TrendingUp', sort_order: 0,
  title_tw: '', challenge_tw: '', solution_tw: '', benefit_tw: '',
  detail_challenge_tw: '', detail_solution_tw: '', detail_benefit_tw: '',
  title_cn: '', challenge_cn: '', solution_cn: '', benefit_cn: '',
  detail_challenge_cn: '', detail_solution_cn: '', detail_benefit_cn: '',
  title_en: '', challenge_en: '', solution_en: '', benefit_en: '',
  detail_challenge_en: '', detail_solution_en: '', detail_benefit_en: '',
}

const inp  = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/40 focus:border-cris-blue text-sm transition-colors'
const ta   = `${inp} resize-none leading-relaxed`

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
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

// ─── Case form (create / edit) ────────────────────────────────────────────────

function CaseForm({ row, onBack, onSaved, session, AdminHeader, onSection }) {
  const isEdit = !!row
  const [form, setForm]   = useState(isEdit ? { ...row } : { ...EMPTY })
  const [lang, setLang]   = useState('tw')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [toast, setToast]   = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function set(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error: err } = isEdit
      ? await supabase.from('cases').update(form).eq('id', row.id)
      : await supabase.from('cases').insert([form])
    setSaving(false)
    if (err) setError(err.message)
    else onSaved()
  }

  const IconComp = ICON_MAP[form.icon_name] || ICON_MAP.TrendingUp

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} crumb={isEdit ? '編輯案例' : '新增案例'} section="cases" onSection={onSection} />

      <form onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-8 space-y-5 pb-16">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* Shared fields */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">基本設定</h2>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">分類</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(c => (
                <button key={c.key} type="button"
                  onClick={() => setForm(f => ({ ...f, category: c.key }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    form.category === c.key
                      ? 'bg-cris-blue text-white shadow-sm shadow-cris-blue/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              圖示 <span className="text-slate-400 font-normal text-xs">（目前：<IconComp size={13} className="inline -mt-0.5" /> {form.icon_name}）</span>
            </label>
            <div className="grid grid-cols-7 gap-2">
              {ICON_NAMES.map(name => {
                const IC = ICON_MAP[name]
                return (
                  <button key={name} type="button"
                    onClick={() => setForm(f => ({ ...f, icon_name: name }))}
                    title={name}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-medium transition-all cursor-pointer ${
                      form.icon_name === name
                        ? 'bg-cris-blue text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                    }`}>
                    <IC size={16} />
                    <span className="leading-none truncate w-full text-center px-1">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort order */}
          <div className="max-w-[120px]">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">排列順序</label>
            <input type="number" name="sort_order" value={form.sort_order} onChange={set} min={0} className={inp} />
            <p className="text-xs text-slate-400 mt-1">數字越小越前面</p>
          </div>
        </div>

        {/* Language tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-slate-100">
            {LANG_TABS.map(l => (
              <button key={l.code} type="button" onClick={() => setLang(l.code)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                  lang === l.code
                    ? 'text-cris-blue border-b-2 border-cris-blue bg-cris-blue/[0.03]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                標題 <span className="text-red-500">*</span>
              </label>
              <input name={`title_${lang}`} required value={form[`title_${lang}`]} onChange={set}
                placeholder="案例標題" className={inp} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">挑戰摘要 <span className="text-slate-400 font-normal text-xs">（卡片）</span></label>
                <textarea name={`challenge_${lang}`} rows={3} value={form[`challenge_${lang}`]} onChange={set}
                  placeholder="一句話說明挑戰" className={ta} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">解決方案摘要 <span className="text-slate-400 font-normal text-xs">（卡片）</span></label>
                <textarea name={`solution_${lang}`} rows={3} value={form[`solution_${lang}`]} onChange={set}
                  placeholder="一句話說明方案" className={ta} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">效益摘要 <span className="text-slate-400 font-normal text-xs">（卡片）</span></label>
                <textarea name={`benefit_${lang}`} rows={3} value={form[`benefit_${lang}`]} onChange={set}
                  placeholder="一句話說明效益" className={ta} />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">彈窗詳細內容</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">詳細挑戰</label>
                  <textarea name={`detail_challenge_${lang}`} rows={3} value={form[`detail_challenge_${lang}`]} onChange={set}
                    placeholder="詳細說明企業面臨的挑戰..." className={ta} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">詳細解決方案</label>
                  <textarea name={`detail_solution_${lang}`} rows={3} value={form[`detail_solution_${lang}`]} onChange={set}
                    placeholder="詳細說明 CRIS 如何解決..." className={ta} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">詳細效益</label>
                  <textarea name={`detail_benefit_${lang}`} rows={3} value={form[`detail_benefit_${lang}`]} onChange={set}
                    placeholder="詳細說明導入後的成效..." className={ta} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <ArrowLeft size={15} /> 返回
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 cursor-pointer">
            <Save size={16} />
            {saving ? '儲存中...' : isEdit ? '更新案例' : '新增案例'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Cases list ───────────────────────────────────────────────────────────────

export default function AdminCasesView({ session, AdminHeader, onSection }) {
  const [cases,    setCases]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [view,     setView]     = useState('list')
  const [editing,  setEditing]  = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [toast,    setToast]    = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('cases').select('*').order('sort_order', { ascending: true })
    if (error) showToast('載入失敗：' + error.message, 'error')
    setCases(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirmDelete() {
    const { error } = await supabase.from('cases').delete().eq('id', deleteId)
    if (error) showToast('刪除失敗：' + error.message, 'error')
    else { showToast('已刪除案例'); setCases(prev => prev.filter(c => c.id !== deleteId)) }
    setDeleteId(null)
  }

  if (view === 'new')
    return <CaseForm row={null} session={session} AdminHeader={AdminHeader} onSection={onSection}
      onBack={() => setView('list')} onSaved={() => { setView('list'); load() }} />
  if (view === 'edit')
    return <CaseForm row={editing} session={session} AdminHeader={AdminHeader} onSection={onSection}
      onBack={() => setView('list')} onSaved={() => { setView('list'); load() }} />

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} section="cases" onSection={onSection} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">成功案例管理</h1>
            <p className="text-sm text-slate-500 mt-0.5">共 {cases.length} 筆 · 新增後前台即時更新</p>
          </div>
          <button onClick={() => setView('new')}
            className="flex items-center gap-2 bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer">
            <Plus size={16} /> 新增案例
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <GripVertical size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">還沒有案例</p>
            <p className="text-slate-400 text-sm mt-1">目前前台顯示預設的 14 筆案例。新增後將改為顯示這裡的資料。</p>
            <button onClick={() => setView('new')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cris-blue text-white text-sm font-semibold rounded-xl cursor-pointer">
              <Plus size={15} /> 新增第一筆案例
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">標題（繁中）</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">分類</th>
                  <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">圖示</th>
                  <th className="hidden md:table-cell text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">順序</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cases.map(c => {
                  const Icon = ICON_MAP[c.icon_name] || ICON_MAP.TrendingUp
                  const cat  = CATEGORIES[c.category]
                  return (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 truncate max-w-[240px]">{c.title_tw || '（未填繁中標題）'}</div>
                        {c.challenge_tw && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px]">{c.challenge_tw}</div>}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4">
                        {cat ? (
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.tagClass}`}>
                            {CATEGORY_OPTIONS.find(o => o.key === c.category)?.label || c.category}
                          </span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Icon size={14} className="text-slate-600" />
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 text-center text-slate-500 text-xs font-mono">
                        {c.sort_order}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => { setEditing(c); setView('edit') }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cris-blue hover:bg-cris-blue/10 transition-colors cursor-pointer">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteId(c.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
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
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  取消
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer">
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
