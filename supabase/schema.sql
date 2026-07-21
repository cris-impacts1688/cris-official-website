-- ============================================================================
-- CRIS 官網 — Supabase 資料庫結構（一次性建立）
-- 使用方式：在新的 Supabase 專案 → SQL Editor → 貼上整份執行一次即可。
-- 內容：5 張資料表 + Row Level Security 權限 + media 圖片 bucket
-- 對應程式碼：src/ 下所有 supabase.from(...) / storage 呼叫
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. site_content — CMS 可編輯文案（各頁面、各語系）
--    使用位置：src/hooks/useCmsContent.js, src/pages/AdminContent.jsx
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.site_content (
  id           uuid primary key default gen_random_uuid(),
  page_id      text not null,
  section_key  text not null,
  lang         text not null default 'zh-TW',
  content_html text not null default '',
  updated_at   timestamptz not null default now(),
  unique (page_id, section_key, lang)
);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. posts — 新聞文章
--    使用位置：src/components/News.jsx（依 created_at 排序）,
--             src/pages/NewsPost.jsx, src/pages/Admin.jsx（新增/編輯）
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default '',
  category     text default '',
  excerpt      text default '',
  content      text default '',
  image_url    text default '',
  ai_tags      text[] not null default '{}',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. cases — 案例分享（三語系：_tw / _cn / _en）
--    使用位置：src/components/CaseStudies.jsx（依 sort_order 排序）,
--             src/pages/AdminCases.jsx
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.cases (
  id                  uuid primary key default gen_random_uuid(),
  category            text not null default 'finance',
  icon_name           text not null default 'TrendingUp',
  sort_order          integer not null default 0,

  -- 繁體中文
  title_tw            text default '',
  challenge_tw        text default '',
  solution_tw         text default '',
  benefit_tw          text default '',
  detail_challenge_tw text default '',
  detail_solution_tw  text default '',
  detail_benefit_tw   text default '',

  -- 簡體中文
  title_cn            text default '',
  challenge_cn        text default '',
  solution_cn         text default '',
  benefit_cn          text default '',
  detail_challenge_cn text default '',
  detail_solution_cn  text default '',
  detail_benefit_cn   text default '',

  -- 英文
  title_en            text default '',
  challenge_en        text default '',
  solution_en         text default '',
  benefit_en          text default '',
  detail_challenge_en text default '',
  detail_solution_en  text default '',
  detail_benefit_en   text default '',

  created_at          timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. contact_forms — 聯絡表單投件
--    使用位置：src/components/Contact.jsx, src/pages/ContactPage.jsx（訪客新增）,
--             src/pages/Admin.jsx（管理員檢視/刪除，依 created_at 排序）
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.contact_forms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  email      text not null,
  phone      text,
  message    text,
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. admin_users — 後台管理員名單
--    注意：這只是「名單」；真正的登入帳號建立在 Supabase Auth（Dashboard）。
--    使用位置：src/pages/AdminUsers.jsx（email 需唯一）
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  display_name text default '',
  created_at   timestamptz not null default now()
);


-- ============================================================================
-- Row Level Security（RLS）權限
-- 原則：公開內容匿名可讀；聯絡表單匿名只能新增不能讀；後台資料僅登入者可存取。
-- ============================================================================

alter table public.site_content  enable row level security;
alter table public.posts         enable row level security;
alter table public.cases         enable row level security;
alter table public.contact_forms enable row level security;
alter table public.admin_users   enable row level security;

-- ── 公開可讀 + 登入者可寫：site_content / posts / cases ──────────────────────
create policy "public read site_content" on public.site_content
  for select using (true);
create policy "auth write site_content" on public.site_content
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read posts" on public.posts
  for select using (true);
create policy "auth write posts" on public.posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read cases" on public.cases
  for select using (true);
create policy "auth write cases" on public.cases
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── contact_forms：匿名只能新增（投件），登入者才能讀/刪 ─────────────────────
create policy "public insert contact_forms" on public.contact_forms
  for insert with check (true);
create policy "auth manage contact_forms" on public.contact_forms
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── admin_users：僅登入者可存取 ─────────────────────────────────────────────
create policy "auth manage admin_users" on public.admin_users
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ============================================================================
-- Storage — media bucket（新聞文章上傳圖片用）
-- 對應程式碼：src/pages/Admin.jsx  const BUCKET = 'media'
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 公開可讀（getPublicUrl 需要）
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

-- 登入者可上傳 / 覆寫
create policy "auth upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "auth update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "auth delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
