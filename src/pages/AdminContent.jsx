import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Bold, Italic, List, ListOrdered, Palette,
  RotateCcw, AlertCircle, CheckCircle2, FileText,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { invalidateCmsCache } from '../hooks/useCmsContent'

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGS = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en',    label: 'EN'   },
]

const CMS_PAGES = [
  {
    id: 'aps',
    label: 'APS 排程系統',
    sections: [
      { key: 'hero_desc', label: 'Hero 說明文字', hint: '產品頁主標下方的介紹段落' },
    ],
  },
  {
    id: 'esg',
    label: 'ESG 碳盤查',
    sections: [
      { key: 'hero_desc', label: 'Hero 說明文字', hint: '產品頁主標下方的介紹段落' },
    ],
  },
  {
    id: 'aibox',
    label: 'AI 一體機',
    sections: [
      { key: 'hero_desc', label: 'Hero 說明文字', hint: '產品頁主標下方的介紹段落' },
    ],
  },
  {
    id: 'solutions',
    label: '解決方案',
    sections: [
      { key: 'hero_subtitle',  label: 'Hero 副標題',            hint: '解決方案頁面主標下方的副標' },
      { key: 'module_1_desc',  label: 'AI Agent — 區塊描述',    hint: 'AI Agent 模組卡片說明文字' },
      { key: 'module_2_desc',  label: 'ESG — 區塊描述',         hint: 'ESG 模組卡片說明文字' },
      { key: 'module_3_desc',  label: 'APS — 區塊描述',         hint: 'APS 模組卡片說明文字' },
    ],
  },
]

const SETUP_SQL = `-- 在 Supabase SQL Editor 執行一次：
create table site_content (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,
  section_key text not null,
  lang text not null default 'zh-TW',
  content_html text not null default '',
  updated_at timestamptz default now(),
  unique (page_id, section_key, lang)
);

alter table site_content enable row level security;

create policy "anon read"
  on site_content for select using (true);

create policy "auth write"
  on site_content for all
  using (auth.role() = 'authenticated');`

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

// ─── Tiptap toolbar button ────────────────────────────────────────────────────

function ToolBtn({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-all cursor-pointer ${
        active
          ? 'bg-cris-blue text-white'
          : 'text-slate-600 hover:bg-white hover:shadow-sm'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Tiptap rich text editor ──────────────────────────────────────────────────

function TiptapEditor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">
        <ToolBtn active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()} title="粗體 (Ctrl+B)">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()} title="斜體 (Ctrl+I)">
          <Italic size={14} />
        </ToolBtn>

        <div className="w-px h-4 bg-slate-200 mx-1.5" />

        <ToolBtn active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()} title="無序清單">
          <List size={14} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} title="有序清單">
          <ListOrdered size={14} />
        </ToolBtn>

        <div className="w-px h-4 bg-slate-200 mx-1.5" />

        {/* Color picker */}
        <div className="relative" title="文字顏色">
          <button type="button" className="p-1.5 rounded text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer flex items-center gap-1">
            <Palette size={14} />
            <input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onInput={e => editor.chain().focus().setColor(e.target.value).run()}
              defaultValue="#0052D9"
            />
          </button>
        </div>

        <div className="w-px h-4 bg-slate-200 mx-1.5" />

        <ToolBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="清除格式">
          <RotateCcw size={13} />
        </ToolBtn>
      </div>

      {/* Content area */}
      <EditorContent
        editor={editor}
        className="tiptap-editor px-4 py-3 text-sm text-slate-700 leading-relaxed"
      />
    </div>
  )
}

// ─── Setup screen (shown when table not found) ────────────────────────────────

function SetupScreen() {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(SETUP_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="max-w-2xl mx-auto mt-16 px-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">需要先建立資料表</h3>
            <p className="text-sm text-slate-500 mt-0.5">請在 Supabase Dashboard → SQL Editor 執行以下指令</p>
          </div>
        </div>
        <pre className="bg-slate-900 text-emerald-400 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {SETUP_SQL}
        </pre>
        <div className="flex items-center justify-between mt-4">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cris-blue hover:underline"
          >
            前往 Supabase Dashboard →
          </a>
          <button
            onClick={copy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <><CheckCircle2 size={13} /> 已複製</> : '複製 SQL'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">執行後重新整理此頁面即可開始編輯。</p>
      </div>
    </div>
  )
}

// ─── Main ContentManagerView ──────────────────────────────────────────────────

export default function ContentManagerView({ session, AdminHeader, onSection }) {
  const [selectedPageId,     setSelectedPageId]     = useState(CMS_PAGES[0].id)
  const [selectedSectionKey, setSelectedSectionKey] = useState(CMS_PAGES[0].sections[0].key)
  const [selectedLang,       setSelectedLang]       = useState('zh-TW')
  const [editorContent,      setEditorContent]      = useState('')
  const [originalContent,    setOriginalContent]    = useState('')
  const [loading,            setLoading]            = useState(false)
  const [saving,             setSaving]             = useState(false)
  const [tableExists,        setTableExists]        = useState(true)
  const [toast,              setToast]              = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const selectedPage    = CMS_PAGES.find(p => p.id === selectedPageId)
  const selectedSection = selectedPage?.sections.find(s => s.key === selectedSectionKey)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_content')
        .select('content_html')
        .eq('page_id', selectedPageId)
        .eq('section_key', selectedSectionKey)
        .eq('lang', selectedLang)
        .maybeSingle()

      if (error) {
        if (error.message?.includes('does not exist') || error.code === 'PGRST106') {
          setTableExists(false)
        } else {
          showToast('載入失敗：' + error.message, 'error')
        }
        setLoading(false)
        return
      }

      const html = data?.content_html ?? ''
      setEditorContent(html)
      setOriginalContent(html)
      setLoading(false)
    }
    load()
  }, [selectedPageId, selectedSectionKey, selectedLang])

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('site_content')
      .upsert(
        {
          page_id:      selectedPageId,
          section_key:  selectedSectionKey,
          lang:         selectedLang,
          content_html: editorContent,
          updated_at:   new Date().toISOString(),
        },
        { onConflict: 'page_id,section_key,lang' }
      )
    setSaving(false)
    if (error) {
      showToast('儲存失敗：' + error.message, 'error')
    } else {
      setOriginalContent(editorContent)
      invalidateCmsCache(selectedPageId)
      showToast('儲存成功')
    }
  }

  const isDirty = editorContent !== originalContent

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />
      <AdminHeader session={session} section="content" onSection={onSection} />

      {!tableExists ? <SetupScreen /> : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">頁面內容編輯</h1>
            <p className="text-sm text-slate-500 mt-0.5">編輯後儲存，前台即時更新。未填寫的區塊會顯示預設的多語系文字。</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">選擇頁面</p>
                <div className="space-y-1">
                  {CMS_PAGES.map(page => (
                    <button
                      key={page.id}
                      onClick={() => {
                        setSelectedPageId(page.id)
                        setSelectedSectionKey(page.sections[0].key)
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        selectedPageId === page.id
                          ? 'bg-cris-blue text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPage && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">選擇區塊</p>
                  <div className="space-y-1">
                    {selectedPage.sections.map(sec => (
                      <button
                        key={sec.key}
                        onClick={() => setSelectedSectionKey(sec.key)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                          selectedSectionKey === sec.key
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-sm font-medium">{sec.label}</div>
                        <div className={`text-[11px] mt-0.5 leading-tight ${selectedSectionKey === sec.key ? 'text-white/60' : 'text-slate-400'}`}>
                          {sec.hint}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Editor panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-slate-400" />
                    <h2 className="font-bold text-slate-900">{selectedSection?.label}</h2>
                    {isDirty && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                        未儲存
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="font-mono">{selectedPageId} / {selectedSectionKey}</span>
                    {selectedSection?.hint && ` · ${selectedSection.hint}`}
                  </p>
                </div>

                {/* Lang switcher */}
                <div className="flex gap-1.5 flex-shrink-0">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLang(l.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedLang === l.code
                          ? 'bg-cris-blue text-white shadow-sm shadow-cris-blue/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor */}
              {loading ? (
                <div className="h-[220px] bg-slate-50 rounded-xl border border-slate-200 animate-pulse" />
              ) : (
                <TiptapEditor
                  key={`${selectedPageId}-${selectedSectionKey}-${selectedLang}`}
                  initialContent={editorContent}
                  onChange={setEditorContent}
                />
              )}

              <p className="text-xs text-slate-400 mt-3">
                支援粗體、斜體、清單與文字顏色。留空則使用預設多語系文字（i18n fallback）。
              </p>

              {/* Save button */}
              <div className="flex justify-end mt-5">
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 cursor-pointer"
                >
                  <Save size={15} />
                  {saving ? '儲存中...' : '儲存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
