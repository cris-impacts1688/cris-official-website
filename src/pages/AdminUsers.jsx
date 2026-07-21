import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ExternalLink, AlertCircle, CheckCircle2, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

const inp = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cris-blue/40 focus:border-cris-blue text-sm transition-colors'

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

export default function AdminUsersView({ session, AdminHeader, onSection }) {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast]       = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [form, setForm]         = useState({ email: '', display_name: '' })
  const [saving, setSaving]     = useState(false)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) showToast('載入失敗：' + error.message, 'error')
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.email.trim()) return
    setSaving(true)
    const { error } = await supabase.from('admin_users').insert([{
      email: form.email.trim().toLowerCase(),
      display_name: form.display_name.trim(),
    }])
    setSaving(false)
    if (error) {
      showToast(error.code === '23505' ? '此 Email 已存在' : '新增失敗：' + error.message, 'error')
    } else {
      showToast('已新增帳號記錄，請前往 Supabase Dashboard 建立登入帳號')
      setForm({ email: '', display_name: '' })
      setShowAdd(false)
      load()
    }
  }

  async function confirmDelete() {
    const { error } = await supabase.from('admin_users').delete().eq('id', deleteId)
    if (error) {
      showToast('刪除失敗：' + error.message, 'error')
    } else {
      showToast('已從名單移除，請記得至 Supabase Dashboard 刪除其登入帳號')
      setUsers(prev => prev.filter(u => u.id !== deleteId))
    }
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} section="users" onSection={onSection} />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">帳號管理</h1>
            <p className="text-sm text-slate-500 mt-0.5">管理可登入後台的人員名單</p>
          </div>
          <button
            onClick={() => setShowAdd(s => !s)}
            className="flex items-center gap-2 bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} /> 新增帳號
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="font-semibold mb-0.5">注意：兩步驟管理</p>
            <p>此名單為記錄用途。實際登入帳號需在 <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-medium hover:text-amber-900">Supabase Dashboard → Authentication → Users</a> 另行建立或刪除。</p>
          </div>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="text-sm font-semibold text-slate-700">新增管理員</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="admin@company.com"
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">姓名</label>
                    <input
                      type="text"
                      value={form.display_name}
                      onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                      placeholder="王小明"
                      className={inp}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    取消
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold transition-colors disabled:opacity-60">
                    {saving ? '新增中...' : '確認新增'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  新增後請前往 Supabase Dashboard → Authentication → Users → Invite user，使用相同 Email 建立登入帳號。
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users table */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Users size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">還沒有管理員記錄，點「新增帳號」開始新增。</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">姓名 / Email</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">建立時間</th>
                  <th className="w-16 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{u.display_name || '—'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('zh-TW', {
                        year: 'numeric', month: '2-digit', day: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setDeleteId(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
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

        {/* Supabase dashboard link */}
        <div className="mt-6 flex items-center justify-end">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cris-blue transition-colors"
          >
            前往 Supabase Dashboard 管理登入帳號 <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Delete confirm modal */}
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
                  <h3 className="font-bold text-slate-900">確認移除</h3>
                  <p className="text-sm text-slate-500">將從名單中移除此帳號記錄。</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-700">
                移除後請至 Supabase Dashboard 刪除對應的登入帳號，否則該帳號仍可登入。
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  取消
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                  確認移除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
