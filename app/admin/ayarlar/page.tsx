'use client'

import { useEffect, useState } from 'react'

type Settings = Record<string, string>

const FIELDS = [
  { section: 'İletişim Bilgileri', items: [
    { key: 'phone', label: 'Telefon Numarası', placeholder: '0850 123 45 67' },
    { key: 'email', label: 'E-posta Adresi', placeholder: 'info@trinkmakina.com' },
    { key: 'address', label: 'Adres', placeholder: 'Mahalle, Cadde, İl' },
    { key: 'working_hours', label: 'Çalışma Saatleri', placeholder: 'Hafta içi 10:00 – 17:00' },
  ]},
  { section: 'Hero Bölümü', items: [
    { key: 'hero_badge', label: 'Üst Etiket Metni', placeholder: 'Türkiye\'nin İlk Sac İşleme Makineleri Alım Platformu' },
    { key: 'hero_title', label: 'Ana Başlık', placeholder: 'Makinenizi bugün satın, nakit ödemenizi hemen alın' },
  ]},
  { section: 'CTA Banner', items: [
    { key: 'cta_banner_title', label: 'Banner Başlık', placeholder: 'Makineniz atıl mı duruyor?' },
    { key: 'cta_banner_subtitle', label: 'Banner Alt Metin', placeholder: 'Hemen formu doldurun…' },
  ]},
]

export default function AyarlarPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false) })
  }, [])

  async function save() {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setMsg(res.ok ? 'Ayarlar kaydedildi ✓' : 'Hata oluştu')
  }

  if (loading) return <div className="text-gray-400 text-center py-20">Yükleniyor…</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Site Ayarları</h1>
      <p className="text-gray-400 text-sm mb-8">İletişim bilgileri ve site içeriklerini buradan güncelleyebilirsiniz.</p>

      <div className="space-y-8">
        {FIELDS.map((section) => (
          <div key={section.section} className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-navy-700">
              {section.section}
            </h2>
            <div className="space-y-4">
              {section.items.map((field) => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  <input
                    className="input-field"
                    placeholder={field.placeholder}
                    value={settings[field.key] ?? ''}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {msg && (
        <p className={`mt-4 text-sm ${msg.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
      )}

      <button onClick={save} disabled={saving} className="btn-primary mt-6 px-8">
        {saving ? 'Kaydediliyor…' : 'Ayarları Kaydet'}
      </button>

      <p className="text-gray-500 text-xs mt-4">
        Not: İletişim bilgisi değişikliklerinin sitede görünmesi için sayfayı yenilemeniz gerekebilir.
      </p>
    </div>
  )
}
