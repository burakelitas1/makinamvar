'use client'

import { useEffect, useState } from 'react'

type FAQ = { id: string; question: string; answer: string; active: boolean; order_num: number }
const EMPTY = { question: '', answer: '', active: true, order_num: 0 }

export default function SSSPage() {
  const [items, setItems] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/admin/faqs')
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.question || !form.answer) { setMsg('Soru ve cevap zorunludur.'); return }
    setSaving(true); setMsg('')
    if (editId) {
      await fetch(`/api/admin/faqs/${editId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/admin/faqs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    }
    setForm(EMPTY); setEditId(null); setSaving(false); setMsg('Kaydedildi ✓')
    load()
  }

  async function del(id: string) {
    if (!confirm('Bu SSS maddesini silmek istiyor musunuz?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    load()
  }

  function edit(item: FAQ) {
    setEditId(item.id)
    setForm({ question: item.question, answer: item.answer, active: item.active, order_num: item.order_num })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Sık Sorulan Sorular</h1>
      <p className="text-gray-400 text-sm mb-8">Sitede gösterilen SSS içeriklerini yönetin.</p>

      {/* Form */}
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">{editId ? 'SSS Düzenle' : 'Yeni SSS Ekle'}</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Soru *</label>
            <input className="input-field" placeholder="Sık sorulan soru…" value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </div>
          <div>
            <label className="label">Cevap *</label>
            <textarea className="input-field resize-none" rows={4} placeholder="Cevap metni…" value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="faq-active" checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-orange-500" />
              <label htmlFor="faq-active" className="text-sm text-gray-300">Sitede göster</label>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Sıra:</label>
              <input type="number" className="input-field w-20" value={form.order_num}
                onChange={(e) => setForm({ ...form, order_num: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        {msg && <p className="text-green-400 text-sm mt-3">{msg}</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={save} disabled={saving} className="btn-primary px-6">
            {saving ? 'Kaydediliyor…' : editId ? 'Güncelle' : 'Ekle'}
          </button>
          {editId && (
            <button onClick={() => { setForm(EMPTY); setEditId(null) }}
              className="px-6 py-2 rounded-lg bg-navy-700 text-gray-300 hover:bg-navy-600 text-sm transition-colors">
              İptal
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-gray-400 text-center py-10">Yükleniyor…</div>
      ) : items.length === 0 ? (
        <div className="bg-navy-900 border border-navy-700 rounded-xl text-center py-10">
          <p className="text-gray-400">Henüz SSS yok. Yukarıdan ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="bg-navy-900 border border-navy-700 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-navy-700 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <p className="text-white font-semibold text-sm">{item.question}</p>
                    {!item.active && <span className="text-xs bg-navy-700 text-gray-400 px-2 py-0.5 rounded-full">Gizli</span>}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 ml-8">{item.answer}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => edit(item)}
                    className="text-xs px-3 py-1.5 bg-navy-700 text-gray-300 hover:bg-navy-600 rounded-lg transition-colors">
                    Düzenle
                  </button>
                  <button onClick={() => del(item.id)}
                    className="text-xs px-3 py-1.5 bg-red-900/40 text-red-400 hover:bg-red-900/70 rounded-lg transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
