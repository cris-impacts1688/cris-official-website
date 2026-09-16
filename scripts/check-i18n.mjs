#!/usr/bin/env node
// 校驗三份 locale 檔的 key 結構完全一致，以及機器讀取的欄位值三語相同。
// i18next 的 fallbackLng 是 zh-TW，缺 key 時會靜默回退、不會報錯，
// 因此需要這支腳本在 build 前把缺漏抓出來。
import { readFileSync } from 'node:fs'

const LOCALES = ['zh-TW', 'zh-CN', 'en']
const BASE = 'zh-TW'

/**
 * 這些欄位是程式讀的列舉值，不是給人看的文案，三份 locale 必須完全相同。
 * 翻譯者很容易把 "up" 譯成「上升」、"delta" 譯成「差量」—— 只比對 key 路徑
 * 抓不到，畫面卻會靜默走錯分支（箭頭方向錯、成果樣式錯、圖標變成 fallback）。
 */
const ENUM_KEYS = new Set(['icon', 'metrics_kind', 'direction'])

/** 把巢狀物件攤平成 key 路徑清單。陣列會記錄長度，並展開每一筆元素的結構。 */
function keyPaths(node, prefix = '') {
  if (Array.isArray(node)) {
    const out = [`${prefix}[] len=${node.length}`]
    node.forEach((item, i) => {
      if (item !== null && typeof item === 'object') {
        out.push(...keyPaths(item, `${prefix}[${i}]`))
      }
    })
    return out
  }
  if (node !== null && typeof node === 'object') {
    return Object.keys(node).flatMap((k) =>
      keyPaths(node[k], prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

/** 蒐集所有列舉欄位的 { 路徑: 值 }，供三語值比對。 */
function enumValues(node, prefix = '', out = {}) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => enumValues(item, `${prefix}[${i}]`, out))
  } else if (node !== null && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const p = prefix ? `${prefix}.${k}` : k
      if (ENUM_KEYS.has(k) && typeof v === 'string') out[p] = v
      else enumValues(v, p, out)
    }
  }
  return out
}

const data = Object.fromEntries(
  LOCALES.map((l) => {
    const path = `src/locales/${l}.json`
    try {
      return [l, JSON.parse(readFileSync(path, 'utf8'))]
    } catch (e) {
      console.error(`✗ 無法讀取 ${path}：${e.message}`)
      process.exit(1)
    }
  })
)

const basePaths = new Set(keyPaths(data[BASE]))
const baseEnums = enumValues(data[BASE])
let failed = false

for (const locale of LOCALES) {
  if (locale === BASE) continue
  const paths = new Set(keyPaths(data[locale]))
  const missing = [...basePaths].filter((p) => !paths.has(p))
  const extra = [...paths].filter((p) => !basePaths.has(p))

  const enums = enumValues(data[locale])
  const wrongValue = Object.entries(baseEnums).filter(
    ([p, v]) => p in enums && enums[p] !== v
  )

  if (missing.length || extra.length || wrongValue.length) {
    failed = true
    console.error(`\n✗ ${locale}`)
    missing.forEach((p) => console.error(`   缺少：${p}`))
    extra.forEach((p) => console.error(`   多餘：${p}`))
    wrongValue.forEach(([p, v]) =>
      console.error(`   列舉值被改動：${p}　應為 "${v}"，實際為 "${enums[p]}"`)
    )
  } else {
    console.log(
      `✓ ${locale} 與 ${BASE} 對齊（${paths.size} 個 key、${Object.keys(enums).length} 個列舉值）`
    )
  }
}

if (failed) {
  console.error(
    '\n多語系不一致。缺少的 key 會靜默 fallback 成繁中；' +
      '列舉值（icon / metrics_kind / direction）被翻譯會讓畫面走錯分支。'
  )
  process.exit(1)
}
console.log('\n三份 locale 檔完全對齊。')
