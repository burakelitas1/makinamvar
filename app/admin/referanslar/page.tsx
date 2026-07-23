'use client'

import { useEffect, useState } from 'react'

type Testimonial = {
  id: string
  name: string
  detail: string
  text: string
  date: string
  active: boolean
}

const EMPTY: Omit<Testimonial, 'id'> = { name: '', detail: '', text: '', date: '', active: true }

export default function ReferanslarPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/testimonials')
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.name || !form.text) { setMsg('Ad ve yorum zorunludur.'); return }
    setSaving(true); setMsg('')
    if (editId) {
      await fetch(`/api/admin/testimonials/${editId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/admin/testimonials', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    }
    setForm(EMPTY); setEditId(null); setSaving(false); setMsg('Kaydedildi ✓')
    load()
  }

  async function del(id: string) {
    if (!confirm('Bu referansı silmek istiyor musunuz?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    load()
  }

  function edit(item: Testimonial) {
    setEditId(item.id)
    setForm({ name: item.name, detail: item.detail, text: item.text, date: item.date, active: item.active })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Referanslar</h1>
      <p className="text-gray-400 text-sm mb-8">Sitede gösterilen müşteri yorumlarını yönetin.</p>

      {/* Form */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">{editId ? 'Referansı Düzenle' : 'Yeni Referans Ekle'}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Ad Soyad *</label>
            <input className="input-field" placeholder="örn. Mehmet K." value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Detay</label>
            <input className="input-field" placeholder="örn. Bursa OSB | 2018 Model Abkant Pres Sattı" value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })} />
          </div>
          <div>
            <label className="label">Tarih</label>
            <input className="input-field" placeholder="örn. 12.03.2026" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="active" checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-orange-500" />
            <label htmlFor="active" className="text-sm text-gray-300">Sitede göster</label>
          </div>
        </div>
        <div className="mb-4">
          <label className="label">Yorum *</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Müşteri yorumu…" value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })} />
        </div>
        {msg && <p className="text-green-400 text-sm mb-3">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="btn-primary px-6">
            {saving ? 'Kaydediliyor…' : editId ? 'Güncelle' : 'Ekle'}
          </button>
          {editId && (
            <button onClick={() => { setForm(EMPTY); setEditId(null) }}
              className="px-6 py-2 rounded-lg bg-[#475569] text-gray-300 hover:bg-navy-600 text-sm transition-colors">
              İptal
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-gray-400 text-center py-10">Yükleniyor…</div>
      ) : items.length === 0 ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl text-center py-10">
          <p className="text-gray-400">Henüz referans yok. Yukarıdan ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {item.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{item.name}</p>
                  {!item.active && <span className="text-xs bg-[#475569] text-gray-400 px-2 py-0.5 rounded-full">Gizli</span>}
                </div>
                <p className="text-[#27AE60] text-xs mb-2">{item.detail}</p>
                <p className="text-gray-300 text-sm line-clamp-2">{item.text}</p>
                <p className="text-gray-500 text-xs mt-1">{item.date}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => edit(item)}
                  className="text-xs px-3 py-1.5 bg-[#475569] text-gray-300 hover:bg-navy-600 rounded-lg transition-colors">
                  Düzenle
                </button>
                <button onClick={() => del(item.id)}
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
