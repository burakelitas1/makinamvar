'use client'

import { useEffect, useState } from 'react'

type Post = {
  id: string
  title: string
  slug: string
  content: string
  cover_image: string | null
  category: string | null
  author_name: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

const EMPTY = { title: '', slug: '', content: '', cover_image: '', category: '', author_name: '', published: false }

async function uploadCoverImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Yükleme hatası')
  return (await res.json()).url
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/posts')
    setPosts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: editId ? f.slug : slugify(title) }))
  }

  async function save() {
    if (!form.title || !form.slug || !form.content) { setMsg('Başlık, slug ve içerik zorunludur.'); return }
    setSaving(true); setMsg('')
    const url = editId ? `/api/admin/posts/${editId}` : '/api/admin/posts'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const j = await res.json()
      setMsg(j.error ?? 'Hata oluştu')
    } else {
      setForm(EMPTY); setEditId(null); setMsg('Kaydedildi ✓')
      load()
    }
    setSaving(false)
  }

  async function del(id: string) {
    if (!confirm('Bu yazıyı silmek istiyor musunuz?')) return
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    load()
  }

  function edit(p: Post) {
    setEditId(p.id)
    setForm({ title: p.title, slug: p.slug, content: p.content, cover_image: p.cover_image ?? '', category: p.category ?? '', author_name: p.author_name ?? '', published: p.published })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Blog</h1>
      <p className="text-[#475569] text-sm mb-8">Blog yazılarını yönetin.</p>

      {/* Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-8">
        <h2 className="text-[#0F172A] font-semibold mb-5">{editId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Başlık *</label>
            <input className="input-field" placeholder="Blog yazısı başlığı" value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <div>
            <label className="label">Slug *</label>
            <input className="input-field" placeholder="url-dostu-baslik" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="label">Kategori</label>
            <input className="input-field" placeholder="örn. Makine Rehberi" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="label">Yazar Adı</label>
            <input className="input-field" placeholder="örn. Trink Makina Ekibi" value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Kapak Görseli</label>
            <div className="flex gap-2 items-start">
              <input className="input-field flex-1" placeholder="https://... (URL) veya aşağıdan yükle" value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
              <label className={`flex-shrink-0 cursor-pointer px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#475569] hover:bg-[#F1F5F9] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? 'Yükleniyor…' : 'Görsel Yükle'}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploading(true)
                  try {
                    const url = await uploadCoverImage(file)
                    setForm((f) => ({ ...f, cover_image: url }))
                  } catch (err: unknown) {
                    setMsg(err instanceof Error ? err.message : 'Yükleme hatası')
                  } finally {
                    setUploading(false)
                    e.target.value = ''
                  }
                }} />
              </label>
            </div>
            {form.cover_image && (
              <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.cover_image} alt="Kapak önizleme" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="label">İçerik *</label>
          <textarea className="input-field resize-y" rows={10} placeholder="Yazı içeriği…" value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input type="checkbox" id="published" checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 accent-[#3B5BDB]" />
          <label htmlFor="published" className="text-sm text-[#475569]">Yayınla (sitede görünsün)</label>
        </div>
        {msg && <p className={`text-sm mb-3 ${msg.includes('✓') ? 'text-green-500' : 'text-red-500'}`}>{msg}</p>}
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="btn-primary px-6">
            {saving ? 'Kaydediliyor…' : editId ? 'Güncelle' : 'Ekle'}
          </button>
          {editId && (
            <button onClick={() => { setForm(EMPTY); setEditId(null) }}
              className="px-6 py-2 rounded-lg bg-[#F1F5F9] text-[#475569] text-sm transition-colors">
              İptal
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-[#475569] text-center py-10">Yükleniyor…</div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl text-center py-10">
          <p className="text-[#475569]">Henüz yazı yok. Yukarıdan ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-[#0F172A] font-semibold text-sm">{p.title}</p>
                  {p.published
                    ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Yayında</span>
                    : <span className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded-full">Taslak</span>}
                  {p.category && <span className="text-xs bg-[#EEF2FF] text-[#3B5BDB] px-2 py-0.5 rounded-full">{p.category}</span>}
                </div>
                <p className="text-[#475569] text-xs">/blog/{p.slug}</p>
                {p.author_name && <p className="text-[#94A3B8] text-xs mt-0.5">{p.author_name}</p>}
                <p className="text-[#475569] text-xs mt-1 line-clamp-2">{p.content.slice(0, 100)}…</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => edit(p)}
                  className="text-xs px-3 py-1.5 bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] rounded-lg transition-colors">
                  Düzenle
                </button>
                <button onClick={() => del(p.id)}
                  className="text-xs px-3 py-1.5 bg-red-900/40 text-red-400 hover:bg-red-900/70 rounded-lg transition-colors">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
