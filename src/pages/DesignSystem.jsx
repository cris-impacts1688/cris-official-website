/**
 * CRIS Design System — 獨立文件頁
 * 路由：/design-system（不顯示於官網導覽列）
 *
 * 結構參考 Adobe Spectrum：
 *   Tokens → Typography → Spacing → Shadows → Radius → Animation
 *   Components：Button · Typography · Card · Badge · FilterPill
 *               CaseCard · Modal · Toast · LangSwitcher · GradientText
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, AlertCircle, Lightbulb, TrendingUp,
  X, CheckCircle2, Sun, Moon, Cpu,
} from 'lucide-react'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Code({ children }) {
  return (
    <pre className="mt-4 bg-slate-950 text-slate-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono">
      {children.trim()}
    </pre>
  )
}

function SectionAnchor({ id, title, subtitle }) {
  return (
    <div className="mb-10">
      <h2 id={id} className="text-2xl font-bold text-slate-900 tracking-tight scroll-mt-20">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      <div className="mt-3 h-px bg-slate-200" />
    </div>
  )
}

function SubSection({ title, children }) {
  return (
    <div className="mb-14">
      <h3 className="text-base font-bold text-slate-700 mb-5 uppercase tracking-widest text-xs">{title}</h3>
      {children}
    </div>
  )
}

function Label({ children }) {
  return <p className="text-xs text-slate-400 mt-2 font-mono">{children}</p>
}

function PreviewBox({ label, children, dark = false }) {
  return (
    <div>
      <div className={`rounded-xl border p-8 flex flex-wrap items-center justify-center gap-4 min-h-[100px] ${
        dark
          ? 'bg-slate-900 border-slate-700'
          : 'bg-slate-50 border-slate-200'
      }`}>
        {children}
      </div>
      {label && <Label>{label}</Label>}
    </div>
  )
}

function AnatomyRow({ name, value, desc }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2.5 pr-6 text-xs font-mono text-cris-blue font-semibold whitespace-nowrap">{name}</td>
      <td className="py-2.5 pr-6 text-xs font-mono text-slate-600 whitespace-nowrap">{value}</td>
      <td className="py-2.5 text-xs text-slate-500">{desc}</td>
    </tr>
  )
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV = [
  { id: 'tokens-color',      label: 'Color Tokens' },
  { id: 'tokens-type',       label: 'Typography' },
  { id: 'tokens-spacing',    label: 'Spacing' },
  { id: 'tokens-shadow',     label: 'Shadows' },
  { id: 'tokens-radius',     label: 'Border Radius' },
  { id: 'tokens-animation',  label: 'Animation' },
  { id: 'comp-button',       label: 'Button' },
  { id: 'comp-type',         label: 'Type Styles' },
  { id: 'comp-card',         label: 'Card' },
  { id: 'comp-badge',        label: 'Badge & Tag' },
  { id: 'comp-filterpill',   label: 'Filter Pill' },
  { id: 'comp-casecard',     label: 'Case Card' },
  { id: 'comp-modal',        label: 'Modal' },
  { id: 'comp-toast',        label: 'Toast' },
  { id: 'comp-langswitcher', label: 'Lang Switcher' },
  { id: 'comp-gradient',     label: 'Gradient Text' },
  { id: 'comp-darkmode',     label: 'Dark Mode Toggle' },
]

function Sidebar({ active }) {
  return (
    <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto pr-2 pb-8 pt-8">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Tokens</p>
      {NAV.slice(0, 6).map(n => (
        <a key={n.id} href={`#${n.id}`}
          className={`block px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
            active === n.id
              ? 'bg-cris-blue/10 text-cris-blue font-semibold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}>
          {n.label}
        </a>
      ))}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 mt-5">Components</p>
      {NAV.slice(6).map(n => (
        <a key={n.id} href={`#${n.id}`}
          className={`block px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
            active === n.id
              ? 'bg-cris-blue/10 text-cris-blue font-semibold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}>
          {n.label}
        </a>
      ))}
    </aside>
  )
}

// ─── Token sections ───────────────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: 'cris-blue',       hex: '#0052D9', tw: 'bg-[#0052D9]',      label: 'Primary / Interactive' },
  { name: 'cris-blue-light', hex: '#4C86E3', tw: 'bg-[#4C86E3]',      label: 'Hover / Accent (dark)' },
  { name: 'cris-blue-dark',  hex: '#003AAA', tw: 'bg-[#003AAA]',       label: 'Pressed / Hover (light)' },
]

const SEMANTIC_LIGHT = [
  { name: 'bg-slate-50',    hex: '#F8FAFC', tw: 'bg-slate-50',    label: 'Page background' },
  { name: 'bg-white',       hex: '#FFFFFF', tw: 'bg-white',        label: 'Surface / Card' },
  { name: 'text-slate-900', hex: '#1E293B', tw: 'bg-slate-900',    label: 'Heading' },
  { name: 'text-slate-600', hex: '#475569', tw: 'bg-slate-600',    label: 'Body text' },
  { name: 'text-slate-500', hex: '#64748B', tw: 'bg-slate-500',    label: 'Secondary / Subtitle' },
  { name: 'text-slate-400', hex: '#94A3B8', tw: 'bg-slate-400',    label: 'Placeholder / Muted' },
  { name: 'border-slate-200',hex: '#E2E8F0',tw: 'bg-slate-200',   label: 'Border' },
  { name: 'border-slate-100',hex: '#F1F5F9',tw: 'bg-slate-100',   label: 'Divider / subtle border' },
]

const SEMANTIC_DARK = [
  { name: 'dark:bg-slate-950', hex: '#0B1121', tw: 'bg-slate-950', label: 'Page background (dark)' },
  { name: 'dark:bg-slate-900', hex: '#0F172A', tw: 'bg-slate-900', label: 'Alt background (dark)' },
  { name: 'dark:bg-slate-800', hex: '#1E293B', tw: 'bg-slate-800', label: 'Surface / Card (dark)' },
  { name: 'dark:text-slate-100',hex: '#F1F5F9',tw: 'bg-slate-100', label: 'Heading (dark)' },
  { name: 'dark:text-slate-400',hex: '#94A3B8',tw: 'bg-slate-400', label: 'Body text (dark)' },
  { name: 'dark:border-slate-700',hex: '#334155',tw: 'bg-slate-700', label: 'Border (dark)' },
]

const CATEGORY_COLORS = [
  { name: 'finance',      bg: '#EFF6FF', text: '#0052D9', border: '#BFDBFE', label: 'Finance — blue' },
  { name: 'support',      bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', label: 'Support — violet' },
  { name: 'manufacturing',bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: 'Manufacturing — emerald' },
  { name: 'green',        bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4', label: 'Green/ESG — teal' },
  { name: 'special',      bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'Special — amber' },
]

function ColorTokens() {
  return (
    <>
      <SectionAnchor id="tokens-color" title="Color Tokens" subtitle="品牌主色與語意色票" />

      <SubSection title="Brand Colors">
        <div className="grid grid-cols-3 gap-4">
          {BRAND_COLORS.map(c => (
            <div key={c.name}>
              <div className={`${c.tw} h-16 rounded-xl`} />
              <p className="mt-2 text-xs font-mono font-semibold text-slate-900">{c.name}</p>
              <p className="text-xs font-mono text-slate-500">{c.hex}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
        <Code>{`/* tailwind.config.js */
colors: {
  cris: {
    blue:       '#0052D9',   // --color-primary
    'blue-light': '#4C86E3', // --color-primary-hover-dark
    'blue-dark':  '#003AAA', // --color-primary-hover-light
  }
}`}</Code>
      </SubSection>

      <SubSection title="Semantic — Light Mode">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEMANTIC_LIGHT.map(c => (
            <div key={c.name}>
              <div className={`${c.tw} h-10 rounded-lg border border-slate-200`} />
              <p className="mt-1.5 text-[10px] font-mono text-slate-600 leading-tight">{c.name}</p>
              <p className="text-[10px] font-mono text-slate-400">{c.hex}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Semantic — Dark Mode">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SEMANTIC_DARK.map(c => (
            <div key={c.name}>
              <div className={`${c.tw} h-10 rounded-lg border border-slate-700`} />
              <p className="mt-1.5 text-[10px] font-mono text-slate-600 leading-tight">{c.name}</p>
              <p className="text-[10px] font-mono text-slate-400">{c.hex}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Category Palette (Cases)">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {CATEGORY_COLORS.map(c => (
            <div key={c.name}>
              <div
                className="h-12 rounded-xl border text-xs font-semibold flex items-center justify-center"
                style={{ background: c.bg, color: c.text, borderColor: c.border }}
              >
                {c.name}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{c.label}</p>
            </div>
          ))}
        </div>
      </SubSection>
    </>
  )
}

const TYPE_SCALE = [
  { cls: 'text-7xl',  size: '72px / 4.5rem',  weight: '700', usage: 'Hero headline (mobile: 60px)',           sample: 'CRIS' },
  { cls: 'text-5xl',  size: '48px / 3rem',     weight: '700', usage: 'Hero headline mobile fallback',          sample: 'AI Agent' },
  { cls: 'text-4xl',  size: '36px / 2.25rem',  weight: '700', usage: 'section-title (desktop)',                sample: '產品特色' },
  { cls: 'text-3xl',  size: '30px / 1.875rem', weight: '700', usage: 'section-title (mobile)',                 sample: '成功案例' },
  { cls: 'text-xl',   size: '20px / 1.25rem',  weight: '400', usage: 'section-subtitle / hero subtitle',       sample: '私有部署，數據不離境' },
  { cls: 'text-lg',   size: '18px / 1.125rem', weight: '500', usage: 'Card heading / CTA label',              sample: 'APS 智慧排程' },
  { cls: 'text-base', size: '16px / 1rem',      weight: '600', usage: 'Case card title / form label',          sample: '自動排程，效率提升 40%' },
  { cls: 'text-sm',   size: '14px / 0.875rem', weight: '400', usage: 'Body copy / table cell',                sample: '整合 MES、ERP，即時回應插單需求' },
  { cls: 'text-xs',   size: '12px / 0.75rem',  weight: '500', usage: 'Category tag / badge / section-tag',    sample: 'SMART MANUFACTURING' },
]

function TypographyTokens() {
  return (
    <>
      <SectionAnchor id="tokens-type" title="Typography" subtitle="字型系統、字重、行距規則" />

      <SubSection title="Font Stack">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-1">
          <p className="text-sm font-mono text-slate-700"><span className="text-cris-blue">primary:</span> Inter</p>
          <p className="text-sm font-mono text-slate-700"><span className="text-cris-blue">fallback:</span> Noto Sans TC</p>
          <p className="text-sm font-mono text-slate-700"><span className="text-cris-blue">weights:</span> 300 · 400 · 500 · 600 · 700 · 800</p>
          <p className="text-sm font-mono text-slate-700"><span className="text-cris-blue">rendering:</span> antialiased</p>
        </div>
        <Code>{`/* index.css */
body {
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
}`}</Code>
      </SubSection>

      <SubSection title="Type Scale">
        <div className="space-y-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Class</th>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Size</th>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</th>
                <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usage</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALE.map(t => (
                <tr key={t.cls} className="border-b border-slate-50">
                  <td className="py-2 pr-4 font-mono text-xs text-cris-blue font-semibold">{t.cls}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 whitespace-nowrap">{t.size}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600">{t.weight}</td>
                  <td className="py-2 text-xs text-slate-500">{t.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Line Height Rules">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { token: 'leading-tight',   val: '1.25', usage: 'section-title, h2' },
            { token: 'leading-snug',    val: '1.375', usage: 'Card h3, modal title' },
            { token: 'leading-relaxed', val: '1.625', usage: 'Body copy, subtitles' },
            { token: 'leading-[1.75]',  val: '1.75',  usage: 'Hero subtitle (large)' },
          ].map(r => (
            <div key={r.token} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-mono text-xs text-cris-blue font-semibold">{r.token}</p>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{r.val}</p>
              <p className="text-xs text-slate-400 mt-1">{r.usage}</p>
            </div>
          ))}
        </div>
      </SubSection>
    </>
  )
}

const SPACING = [
  { val: '4', px: '1px',   usage: 'Micro gap / dot accent' },
  { val: '1', px: '4px',   usage: 'Icon internal padding' },
  { val: '2', px: '8px',   usage: 'Tag gap, badge padding' },
  { val: '3', px: '12px',  usage: 'Small button Y-padding' },
  { val: '4', px: '16px',  usage: 'Card inner gap row' },
  { val: '5', px: '20px',  usage: 'Modal header spacing' },
  { val: '6', px: '24px',  usage: 'Button X-padding (lg), card inner' },
  { val: '8', px: '32px',  usage: 'Card padding (p-8), section header gap' },
  { val: '10', px: '40px', usage: 'Hero CTA margin-top' },
  { val: '12', px: '48px', usage: 'Filter pill mb, section grid gap' },
  { val: '16', px: '64px', usage: 'Hero stats margin-top' },
  { val: '24', px: '96px', usage: 'Section py (py-24)' },
]

function SpacingTokens() {
  return (
    <>
      <SectionAnchor id="tokens-spacing" title="Spacing" subtitle="4pt 網格系統，所有間距為 4 的倍數" />
      <SubSection title="Scale Reference">
        <div className="space-y-2 overflow-x-auto">
          {SPACING.map(s => (
            <div key={s.val + s.px} className="flex items-center gap-4">
              <div className="w-14 flex-shrink-0 font-mono text-xs text-slate-500 text-right">{s.px}</div>
              <div className="bg-cris-blue/80 rounded h-4" style={{ width: `${parseInt(s.px) * 2}px`, minWidth: '2px' }} />
              <div className="font-mono text-xs text-slate-400">{s.usage}</div>
            </div>
          ))}
        </div>
        <Code>{`/* Tailwind scale (rem, 1 unit = 4px) */
gap-2  → 8px   gap-4  → 16px  gap-6  → 24px
px-4   → 16px  px-6   → 24px  py-3   → 12px
mb-6   → 24px  mt-10  → 40px  py-24  → 96px`}</Code>
      </SubSection>
    </>
  )
}

const SHADOWS = [
  { cls: 'shadow-sm',            css: '0 1px 2px rgb(0 0 0 / 0.05)',                   usage: 'Card default, nav pills' },
  { cls: 'shadow-md',            css: '0 4px 6px -1px rgb(0 0 0 / 0.1)',              usage: 'Active filter pill' },
  { cls: 'shadow-lg',            css: '0 10px 15px -3px rgb(0 0 0 / 0.1)',            usage: 'Card hover, dropdown' },
  { cls: 'shadow-xl',            css: '0 20px 25px -5px rgb(0 0 0 / 0.1)',            usage: 'CTA button, nav CTA' },
  { cls: 'shadow-2xl',           css: '0 25px 50px -12px rgb(0 0 0 / 0.25)',          usage: 'Modal overlay panel' },
  { cls: 'shadow-cris-blue/20',  css: '0 4px 6px rgb(0 82 217 / 0.20)',              usage: 'btn-primary default' },
  { cls: 'shadow-cris-blue/40',  css: '0 10px 15px rgb(0 82 217 / 0.40)',            usage: 'btn-primary hover' },
  { cls: 'shadow-slate-200/60',  css: '0 10px 15px rgb(226 232 240 / 0.60)',         usage: 'Card hover (light)' },
]

function ShadowTokens() {
  return (
    <>
      <SectionAnchor id="tokens-shadow" title="Shadows" subtitle="陰影層級與著色陰影規則" />
      <SubSection title="Shadow Scale">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {SHADOWS.slice(0, 4).map(s => (
            <div key={s.cls}>
              <div className={`bg-white rounded-xl h-16 ${s.cls}`} />
              <p className="mt-2 text-xs font-mono text-cris-blue">{s.cls}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.usage}</p>
            </div>
          ))}
        </div>
      </SubSection>
      <SubSection title="Colored Shadows (brand)">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {SHADOWS.slice(4).map(s => (
            <div key={s.cls}>
              <div className={`bg-cris-blue rounded-xl h-12 ${s.cls}`} />
              <p className="mt-2 text-[10px] font-mono text-cris-blue break-all">{s.cls}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.usage}</p>
            </div>
          ))}
        </div>
        <Code>{`/* Colored shadow pattern */
shadow-md shadow-cris-blue/20           /* default */
hover:shadow-lg hover:shadow-cris-blue/40  /* hover  */`}</Code>
      </SubSection>
    </>
  )
}

const RADII = [
  { cls: 'rounded-lg',  val: '8px',   usage: 'Button, input, small tag' },
  { cls: 'rounded-xl',  val: '12px',  usage: 'Dropdown, tooltip, filter pill' },
  { cls: 'rounded-2xl', val: '16px',  usage: 'Card, modal, admin panel' },
  { cls: 'rounded-full',val: '9999px',usage: 'Badge, category pill, avatar' },
]

function RadiusTokens() {
  return (
    <>
      <SectionAnchor id="tokens-radius" title="Border Radius" subtitle="圓角層級系統" />
      <SubSection title="Radius Scale">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {RADII.map(r => (
            <div key={r.cls}>
              <div className={`bg-slate-200 h-16 w-full ${r.cls}`} />
              <p className="mt-2 text-xs font-mono text-cris-blue">{r.cls}</p>
              <p className="text-xs font-mono text-slate-500">{r.val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.usage}</p>
            </div>
          ))}
        </div>
      </SubSection>
    </>
  )
}

const ANIM = [
  { name: 'duration-200',    val: '200ms',  usage: 'Hover state transitions (color, border, translate)' },
  { name: 'duration-300',    val: '300ms',  usage: 'Card hover elevation, modal appear' },
  { name: 'duration-500',    val: '500ms',  usage: 'Section scroll-in fade' },
  { name: 'ease-out',        val: 'cubic-bezier(0,0,.39,1)', usage: 'Entering elements' },
  { name: 'ease-in',         val: 'cubic-bezier(.61,0,1,1)', usage: 'Exiting elements' },
  { name: 'spring 260/22',   val: 'stiffness 260 · damping 22', usage: 'Hero item entrance (itemVariants)' },
  { name: 'spring 320/22',   val: 'stiffness 320 · damping 22', usage: 'Badge entrance (badgeVariants)' },
  { name: 'stagger 0.13s',   val: '130ms per child',  usage: 'Hero container stagger (containerVariants)' },
  { name: 'stagger 0.1s',    val: '100ms per card',   usage: 'Case card grid stagger (index % 3 × 0.1)' },
  { name: 'gradient-shift',  val: '6s ease infinite', usage: 'text-gradient-anim (hero, ESG, AI Box)' },
  { name: 'hover translate',  val: '-translate-y-0.5 / -translate-y-1', usage: 'Button hover, card hover' },
  { name: 'active scale',     val: 'scale-[0.97]',   usage: 'Button active press feedback' },
]

function AnimationTokens() {
  return (
    <>
      <SectionAnchor id="tokens-animation" title="Animation" subtitle="時序、緩動、Spring 參數" />
      <SubSection title="Timing & Motion Tokens">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Token</th>
                <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Value</th>
                <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usage</th>
              </tr>
            </thead>
            <tbody>
              {ANIM.map(a => (
                <tr key={a.name} className="border-b border-slate-50">
                  <td className="py-2 pr-6 font-mono text-xs text-cris-blue font-semibold whitespace-nowrap">{a.name}</td>
                  <td className="py-2 pr-6 font-mono text-xs text-slate-600 whitespace-nowrap">{a.val}</td>
                  <td className="py-2 text-xs text-slate-500">{a.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Code>{`/* framer-motion: Hero item entrance */
const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

/* framer-motion: Container stagger */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.18 } },
}`}</Code>
      </SubSection>
    </>
  )
}

// ─── Component sections ───────────────────────────────────────────────────────

function ButtonSection() {
  return (
    <>
      <SectionAnchor id="comp-button" title="Button" subtitle="主要互動入口，分 Primary / Outline 兩種變體" />

      <SubSection title="Variants">
        <PreviewBox label=".btn-primary  /  .btn-outline">
          <button className="btn-primary">立即預約 Demo <ArrowRight size={16} /></button>
          <button className="btn-outline">了解更多</button>
        </PreviewBox>
        <Code>{`/* index.css — @layer components */
.btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3
    bg-cris-blue text-white font-semibold rounded-lg
    hover:bg-cris-blue-dark active:scale-[0.97]
    transition-all duration-200
    shadow-md shadow-cris-blue/20
    hover:shadow-lg hover:shadow-cris-blue/40
    hover:-translate-y-0.5;
}

.btn-outline {
  @apply inline-flex items-center gap-2 px-6 py-3
    border-2 border-cris-blue text-cris-blue font-semibold rounded-lg
    hover:bg-cris-blue hover:text-white active:scale-[0.97]
    transition-all duration-200
    dark:border-cris-blue-light dark:text-cris-blue-light
    dark:hover:bg-cris-blue dark:hover:text-white;
}`}</Code>
      </SubSection>

      <SubSection title="Size Variants (ad-hoc)">
        <PreviewBox label="text-sm px-5 py-2.5  /  text-base px-8 py-4">
          <button className="btn-primary text-sm px-5 py-2.5">小型 CTA <ArrowRight size={13} /></button>
          <button className="btn-primary text-base px-8 py-4">大型 CTA <ArrowRight size={18} /></button>
        </PreviewBox>
        <p className="text-xs text-slate-500 mt-3">尺寸透過 override class 控制，無獨立 size prop。sm 用於 Modal footer；lg 用於 Hero CTA。</p>
      </SubSection>

      <SubSection title="States">
        <PreviewBox>
          <button className="btn-primary">Default</button>
          <button className="btn-primary opacity-60 cursor-not-allowed">Disabled</button>
          <button className="btn-primary bg-cris-blue-dark shadow-lg shadow-cris-blue/40 -translate-y-0.5">Hover</button>
          <button className="btn-primary scale-[0.97]">Active</button>
        </PreviewBox>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="background"    value="bg-cris-blue (#0052D9)"  desc="Primary CTA fill" />
            <AnatomyRow name="hover bg"      value="bg-cris-blue-dark (#003AAA)" desc="10% luminance decrease" />
            <AnatomyRow name="text"          value="text-white / text-cris-blue" desc="Varies by variant" />
            <AnatomyRow name="font-weight"   value="font-semibold (600)"     desc="Always 600 on buttons" />
            <AnatomyRow name="border-radius" value="rounded-lg (8px)"        desc="Consistent with inputs" />
            <AnatomyRow name="padding"       value="px-6 py-3 (24px / 12px)" desc="Default size" />
            <AnatomyRow name="shadow"        value="shadow-md shadow-cris-blue/20" desc="Colored drop shadow" />
            <AnatomyRow name="active scale"  value="scale-[0.97]"            desc="Press feedback" />
            <AnatomyRow name="hover lift"    value="-translate-y-0.5 (2px)"  desc="Elevation cue on hover" />
          </tbody>
        </table>
      </SubSection>

      <SubSection title="Product-Contextual CTA Colors">
        <PreviewBox>
          <button className="inline-flex items-center gap-1.5 text-sm py-2 px-4 rounded-lg font-semibold text-white shadow-lg bg-cris-blue hover:bg-cris-blue-dark">APS 預約諮詢</button>
          <button className="inline-flex items-center gap-1.5 text-sm py-2 px-4 rounded-lg font-semibold text-white shadow-lg bg-green-600 hover:bg-green-700">ESG 預約諮詢</button>
          <button className="inline-flex items-center gap-1.5 text-sm py-2 px-4 rounded-lg font-semibold text-white shadow-lg bg-violet-600 hover:bg-violet-700">AI Box 預約諮詢</button>
        </PreviewBox>
        <p className="text-xs text-slate-500 mt-3">Navbar 右側 CTA 依當前路由切換顏色，使用 <code className="text-cris-blue font-mono">ctaStyle</code> map。</p>
      </SubSection>
    </>
  )
}

function TypeStylesSection() {
  return (
    <>
      <SectionAnchor id="comp-type" title="Type Styles" subtitle="section-title · section-subtitle · section-tag" />

      <SubSection title="Component Classes">
        <PreviewBox label=".section-title  /  .section-subtitle">
          <div className="text-center w-full">
            <span className="text-xs font-semibold text-cris-blue uppercase tracking-widest">SMART MANUFACTURING</span>
            <h2 className="section-title mt-2">區塊標題文字</h2>
            <p className="section-subtitle">這裡是區塊副標，說明此功能的核心價值與使用情境。</p>
          </div>
        </PreviewBox>
        <Code>{`/* section-title */
@apply text-3xl md:text-4xl font-bold
  text-slate-900 dark:text-slate-100
  tracking-tight leading-tight;

/* section-subtitle */
@apply text-lg text-slate-600 dark:text-slate-400
  mt-4 max-w-2xl mx-auto leading-relaxed;

/* section-tag (行內 span) */
text-sm font-semibold text-cris-blue dark:text-cris-blue-light
uppercase tracking-widest`}</Code>
      </SubSection>
    </>
  )
}

function CardSection() {
  return (
    <>
      <SectionAnchor id="comp-card" title="Card" subtitle="白色圓角卡片，hover 上浮" />

      <SubSection title="Default Card">
        <PreviewBox label=".card">
          <div className="card max-w-sm w-full">
            <h3 className="text-base font-bold text-slate-900 mb-2">功能卡片標題</h3>
            <p className="text-sm text-slate-500 leading-relaxed">說明此功能模組的主要效益與使用情境，控制在 2–3 行以內。</p>
          </div>
        </PreviewBox>
        <Code>{`/* index.css */
.card {
  @apply bg-white dark:bg-slate-800 rounded-2xl shadow-sm
    border border-slate-100 dark:border-slate-700/70
    p-8
    hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60
    hover:border-slate-200 dark:hover:border-slate-600
    transition-all duration-300 hover:-translate-y-1;
}`}</Code>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="background"    value="bg-white / dark:bg-slate-800"    desc="Surface color" />
            <AnatomyRow name="border"        value="border-slate-100 (1px)"          desc="Subtle outline" />
            <AnatomyRow name="border-radius" value="rounded-2xl (16px)"              desc="Soft, modern" />
            <AnatomyRow name="padding"       value="p-8 (32px all sides)"            desc="Spacious interior" />
            <AnatomyRow name="shadow"        value="shadow-sm → hover:shadow-lg"     desc="Progressive elevation" />
            <AnatomyRow name="hover lift"    value="-translate-y-1 (4px)"            desc="Physical feedback" />
            <AnatomyRow name="transition"    value="duration-300"                    desc="Slower than button (card = large surface)" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}

function BadgeSection() {
  return (
    <>
      <SectionAnchor id="comp-badge" title="Badge & Tag" subtitle="類別標籤、徽章、段落標籤" />

      <SubSection title="Category Tag (Cases)">
        <PreviewBox label="category tag — inline-flex rounded-full border">
          {[
            { bg: 'bg-blue-50', text: 'text-cris-blue', border: 'border-blue-200', label: '經營財務' },
            { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: '技術支援' },
            { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: '智能製造' },
            { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', label: '綠色永續' },
            { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '特殊應用' },
          ].map(b => (
            <span key={b.label} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${b.bg} ${b.text} border ${b.border}`}>
              {b.label}
            </span>
          ))}
        </PreviewBox>
        <Code>{`<span className="inline-flex items-center gap-1.5 text-xs font-medium
  px-2.5 py-1 rounded-full
  bg-blue-50 dark:bg-blue-900/30
  text-cris-blue dark:text-blue-300
  border border-blue-200 dark:border-blue-700/50">
  <Icon size={11} strokeWidth={2} />
  經營財務
</span>`}</Code>
      </SubSection>

      <SubSection title="Hero Badge">
        <PreviewBox label="rounded-full bg-cris-blue/8 border-cris-blue/20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cris-blue/[0.08] border border-cris-blue/20">
            <Cpu size={13} className="text-cris-blue" />
            <span className="w-1.5 h-1.5 rounded-full bg-cris-blue animate-pulse" />
            <span className="text-xs font-semibold text-cris-blue tracking-widest uppercase">INDUSTRIAL AI PLATFORM</span>
          </span>
        </PreviewBox>
      </SubSection>

      <SubSection title="Private Deploy Badge (Modal)">
        <PreviewBox label="bg-cris-blue/7  border-cris-blue/20  rounded-xl px-4 py-3">
          <div className="flex items-center gap-2.5 bg-cris-blue/[0.07] border border-cris-blue/20 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-cris-blue">私有化部署 · CRIS AI 一體機</span>
          </div>
        </PreviewBox>
      </SubSection>

      <SubSection title="AI Tag (News)">
        <PreviewBox label="bg-violet-600 rounded-lg text-xs font-semibold">
          {['AI Agent', 'RAG', 'On-Premise', 'AIoT'].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white shadow-sm shadow-violet-600/30">
              {tag}
            </span>
          ))}
        </PreviewBox>
      </SubSection>
    </>
  )
}

function FilterPillSection() {
  const [active, setActive] = useState('all')
  const keys = ['all', 'finance', 'support', 'manufacturing', 'green', 'special']
  const labels = { all: '全部', finance: '經營財務', support: '技術支援', manufacturing: '智能製造', green: '綠色永續', special: '特殊應用' }

  return (
    <>
      <SectionAnchor id="comp-filterpill" title="Filter Pill" subtitle="可切換的分類篩選器，用於 CaseStudies" />

      <SubSection title="Interactive Demo">
        <PreviewBox label="FilterPills — active state: bg-cris-blue text-white shadow-md">
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {keys.map(k => (
              <button key={k} onClick={() => setActive(k)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active === k
                    ? 'bg-cris-blue text-white shadow-md shadow-cris-blue/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-cris-blue hover:text-cris-blue'
                }`}>
                {labels[k]}
              </button>
            ))}
          </div>
        </PreviewBox>
        <Code>{`/* Active */
px-4 py-2 rounded-full text-sm font-medium
bg-cris-blue text-white shadow-md shadow-cris-blue/25

/* Inactive */
bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
border border-slate-200 dark:border-slate-700
hover:border-cris-blue hover:text-cris-blue`}</Code>
      </SubSection>
    </>
  )
}

function CaseCardSection() {
  const sampleData = {
    title: 'APS 智慧排程 × 半導體廠',
    challenge: '插單頻繁，人工排程耗時 4 小時以上，交期預測準確率不足 60%。',
    solution: '導入 APS 引擎，整合 MES/ERP，即時重排並自動通知下游。',
    benefit: '排程效率提升 80%，交期達成率提升至 94%。',
  }

  return (
    <>
      <SectionAnchor id="comp-casecard" title="Case Card" subtitle="成功案例卡片，含 hover CTA reveal" />

      <SubSection title="Card Preview">
        <div className="max-w-sm">
          <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-cris-blue/30 transition-all duration-200">
            <div className="h-0.5 w-full bg-slate-200 group-hover:bg-cris-blue transition-colors duration-200" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  智能製造
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-4 leading-snug">{sampleData.title}</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-slate-500">
                  <AlertCircle size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{sampleData.challenge}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-500">
                  <Lightbulb size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{sampleData.solution}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-cris-blue font-medium">
                  <TrendingUp size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{sampleData.benefit}</span>
                </li>
              </ul>
              <div className="mt-5 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-cris-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  查看詳情 <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <Code>{`/* Top accent line — animates on hover */
<div className="h-0.5 w-full bg-slate-200 group-hover:bg-cris-blue transition-colors" />

/* Icon row pattern */
<AlertCircle />  Challenge (slate-400)
<Lightbulb  />  Solution  (slate-400)
<TrendingUp />  Benefit   (cris-blue — emphasis)

/* Hover CTA reveal */
opacity-0 group-hover:opacity-100 transition-opacity duration-200`}</Code>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="container"     value="bg-white rounded-2xl border-slate-100 shadow-sm" desc="Base card surface" />
            <AnatomyRow name="top-accent"    value="h-0.5 bg-slate-200 → bg-cris-blue"   desc="Animates on group-hover" />
            <AnatomyRow name="category-tag"  value="rounded-full bg-slate-100 text-xs"   desc="Category indicator" />
            <AnatomyRow name="title"         value="text-base font-bold leading-snug"     desc="Case headline" />
            <AnatomyRow name="challenge row" value="AlertCircle + text-slate-500"         desc="Pain point" />
            <AnatomyRow name="solution row"  value="Lightbulb + text-slate-500"           desc="How we solved it" />
            <AnatomyRow name="benefit row"   value="TrendingUp + text-cris-blue font-medium" desc="Outcome — visually distinct" />
            <AnatomyRow name="hover CTA"     value="opacity-0 → opacity-100 on group-hover" desc="Progressive disclosure" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}

function ModalSection() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SectionAnchor id="comp-modal" title="Modal" subtitle="案例詳情彈窗，含 backdrop blur + spring animation" />

      <SubSection title="Interactive Demo">
        <PreviewBox>
          <button className="btn-primary" onClick={() => setOpen(true)}>開啟 Modal</button>
        </PreviewBox>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="h-0.5 w-full bg-cris-blue rounded-t-2xl" />
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Modal 標題</h2>
                    <button onClick={() => setOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
                      <X size={15} className="text-slate-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm text-slate-600 leading-relaxed">Modal 內容區塊，可放置詳細說明或表單。</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="btn-primary text-sm px-5 py-2.5 flex-1 justify-center">主要動作</button>
                    <button onClick={() => setOpen(false)} className="btn-outline text-sm px-5 py-2.5 flex-1 justify-center cursor-pointer">關閉</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <Code>{`/* Backdrop */
fixed inset-0 z-50 bg-black/50 backdrop-blur-sm

/* Panel */
bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto

/* Entrance animation */
initial={{ opacity: 0, scale: 0.95, y: 12 }}
animate={{ opacity: 1, scale: 1,    y: 0  }}
exit   ({ opacity: 0, scale: 0.95, y: 12 }}
transition={{ duration: 0.22, ease: 'easeOut' }}

/* Top accent */
<div className="h-0.5 w-full bg-cris-blue rounded-t-2xl" />`}</Code>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="backdrop"      value="bg-black/50 backdrop-blur-sm"     desc="Dims and blurs page behind" />
            <AnatomyRow name="panel"         value="rounded-2xl shadow-2xl max-w-2xl" desc="Content container" />
            <AnatomyRow name="top accent"    value="h-0.5 bg-cris-blue"              desc="Brand stripe" />
            <AnatomyRow name="close button"  value="w-8 h-8 rounded-full bg-slate-100" desc="Icon-only, top-right" />
            <AnatomyRow name="scroll"        value="max-h-[88vh] overflow-y-auto"     desc="Long content containment" />
            <AnatomyRow name="footer"        value="flex gap-3 — primary + outline"   desc="Primary action left, cancel right" />
            <AnatomyRow name="z-index"       value="z-50"                             desc="Above all page content" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}

function ToastSection() {
  const [toast, setToast] = useState(null)
  function show(type) {
    setToast({ msg: type === 'success' ? '操作成功！' : '發生錯誤，請稍後再試。', type })
    setTimeout(() => setToast(null), 3000)
  }
  return (
    <>
      <SectionAnchor id="comp-toast" title="Toast" subtitle="操作回饋通知，3–3.5 秒自動消失" />
      <SubSection title="Interactive Demo">
        <PreviewBox>
          <button className="btn-primary text-sm px-4 py-2" onClick={() => show('success')}>
            <CheckCircle2 size={15} /> 成功 Toast
          </button>
          <button className="btn-outline text-sm px-4 py-2" onClick={() => show('error')}>
            <AlertCircle size={15} /> 錯誤 Toast
          </button>
        </PreviewBox>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
                toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
              {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
        <Code>{`/* Success */
bg-emerald-600 text-white rounded-xl shadow-lg px-4 py-3

/* Error */
bg-red-600 text-white rounded-xl shadow-lg px-4 py-3

/* Animation */
initial={{ opacity: 0, y: -16 }}
animate={{ opacity: 1, y: 0  }}
exit   ({ opacity: 0, y: -16 }}

/* Auto-dismiss */
setTimeout(() => setToast(null), 3000)`}</Code>
      </SubSection>
    </>
  )
}

function LangSwitcherSection() {
  const [lang, setLang] = useState('zh-TW')
  const langs = [{ code: 'zh-TW', label: '繁中' }, { code: 'zh-CN', label: '简中' }, { code: 'en', label: 'EN' }]
  return (
    <>
      <SectionAnchor id="comp-langswitcher" title="Lang Switcher" subtitle="三語切換器，Navbar 右側固定位置" />
      <SubSection title="Preview">
        <PreviewBox label="bg-slate-100 rounded-lg — active: bg-white shadow-sm">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {langs.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                  lang === l.code
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>{l.label}</button>
            ))}
          </div>
        </PreviewBox>
        <Code>{`/* Container */
bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 flex items-center gap-0.5

/* Active segment */
bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm

/* Inactive segment */
text-slate-500 dark:text-slate-400 hover:text-slate-700`}</Code>
      </SubSection>
    </>
  )
}

function GradientTextSection() {
  return (
    <>
      <SectionAnchor id="comp-gradient" title="Gradient Text" subtitle="品牌漸層文字動畫，3 種變體" />
      <SubSection title="Variants">
        <PreviewBox>
          <div className="text-4xl font-bold text-gradient-anim">CRIS Blue</div>
          <div className="text-4xl font-bold text-gradient-green-anim">ESG Green</div>
          <div className="text-4xl font-bold text-gradient-violet-anim">AI Violet</div>
        </PreviewBox>
        <Code>{`/* Blue (hero, APS) */
.text-gradient-anim {
  background: linear-gradient(135deg, #0052D9, #4C86E3, #818cf8, #60a5fa, #0052D9);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 6s ease infinite;
}

/* Green (ESG) */
.text-gradient-green-anim { /* #059669 → #10b981 → #34d399 → ... */ }

/* Violet (AI Box) */
.text-gradient-violet-anim { /* #7c3aed → #8b5cf6 → #a78bfa → ... */ }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .text-gradient-anim { animation: none; }
}`}</Code>
      </SubSection>
    </>
  )
}

function DarkModeSection() {
  const [dark, setDark] = useState(false)
  return (
    <>
      <SectionAnchor id="comp-darkmode" title="Dark Mode Toggle" subtitle="Sun/Moon icon button，Navbar 固定位置" />
      <SubSection title="Preview">
        <PreviewBox label="p-2 rounded-lg hover:bg-slate-100 / dark:hover:bg-slate-800">
          <button onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-2">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm text-slate-600">{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </PreviewBox>
        <Code>{`/* Navbar dark toggle */
<button
  onClick={() => setDark(!dark)}
  className="p-2 rounded-lg text-slate-500 dark:text-slate-400
    hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  aria-label="Toggle dark mode"
>
  {dark ? <Sun size={20} /> : <Moon size={20} />}
</button>

/* App.jsx — writes to <html> class + localStorage */
if (dark) root.classList.add('dark')
else      root.classList.remove('dark')
localStorage.setItem('theme', dark ? 'dark' : 'light')`}</Code>
      </SubSection>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}Logo_CRIS.png`} alt="CRIS" className="h-8 w-auto" />
            <span className="text-sm font-bold text-slate-800">Design System</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cris-blue/10 text-cris-blue font-semibold">v1.0</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">內部文件 · 不顯示於官網</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 flex gap-12">
        <Sidebar />

        <main className="flex-1 py-12 min-w-0">
          {/* Hero */}
          <div className="mb-16">
            <p className="text-xs font-semibold text-cris-blue uppercase tracking-widest mb-2">CRIS · 快思科技</p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Design System</h1>
            <p className="text-lg text-slate-500 mt-3 max-w-2xl leading-relaxed">
              Design token、元件規格、互動模式的單一事實來源。
              所有頁面均以此為標準實作，確保視覺與行為一致性。
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Color Tokens', val: '17' },
                { label: 'Components', val: '12' },
                { label: 'Animation Tokens', val: '12' },
                { label: 'Type Styles', val: '9' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-cris-blue">{s.val}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Token sections */}
          <ColorTokens />
          <TypographyTokens />
          <SpacingTokens />
          <ShadowTokens />
          <RadiusTokens />
          <AnimationTokens />

          {/* Component sections */}
          <ButtonSection />
          <TypeStylesSection />
          <CardSection />
          <BadgeSection />
          <FilterPillSection />
          <CaseCardSection />
          <ModalSection />
          <ToastSection />
          <LangSwitcherSection />
          <GradientTextSection />
          <DarkModeSection />
        </main>
      </div>
    </div>
  )
}
