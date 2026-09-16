#!/usr/bin/env node
// 校驗三份 locale 檔的 key 結構完全一致。
// i18next 的 fallbackLng 是 zh-TW，缺 key 時會靜默回退、不會報錯，
// 因此需要這支腳本在 build 前把缺漏抓出來。
import { readFileSync } from 'node:fs'

const LOCALES = ['zh-TW', 'zh-CN', 'en']
const BASE = 'zh-TW'

/** 把巢狀物件攤平成 key 路徑清單。陣列會記錄長度，並展開第一筆的結構。 */
function keyPaths(node, prefix = '') {
  if (Array.isArray(node)) {
    const out = [`${prefix}[] len=${node.length}`]
    if (node.length && node[0] !== null && typeof node[0] === 'object') {
      out.push(...keyPaths(node[0], `${prefix}[0]`))
    }
    return out
  }
  if (node !== null && typeof node === 'object') {
    return Object.keys(node).flatMap((k) =>
      keyPaths(node[k], prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

const data = Object.fromEntries(
  LOCALES.map((l) => [l, JSON.parse(readFileSync(`src/locales/${l}.json`, 'utf8'))])
)

const basePaths = new Set(keyPaths(data[BASE]))
let failed = false

for (const locale of LOCALES) {
  if (locale === BASE) continue
  const paths = new Set(keyPaths(data[locale]))
  const missing = [...basePaths].filter((p) => !paths.has(p))
  const extra = [...paths].filter((p) => !basePaths.has(p))

  if (missing.length || extra.length) {
    failed = true
    console.error(`\n✗ ${locale}`)
    missing.forEach((p) => console.error(`   缺少：${p}`))
    extra.forEach((p) => console.error(`   多餘：${p}`))
  } else {
    console.log(`✓ ${locale} 與 ${BASE} 對齊（${paths.size} 個 key）`)
  }
}

if (failed) {
  console.error('\n多語系 key 不一致。缺少的 key 會靜默 fallback 成繁中。')
  process.exit(1)
}
console.log('\n三份 locale 檔完全對齊。')
