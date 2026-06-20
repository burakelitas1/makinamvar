export const metadata = { title: 'Ticari İleti İzni', description: 'Trink Makina ticari elektronik ileti gönderimi hakkında bilgi ve izin yönetimi.' }

export default function TicariIletiPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-[#2C3E50] mb-2">Ticari İleti İzni</h1>
        <p className="text-sm text-gray-400 mb-8">Son güncelleme: Nisan 2026</p>

        <div className="card space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 mb-2">1. Kapsam</h2>
            <p>
              Bu metin, <strong>Varmak Makine Alım Satım Hizmetleri Ltd. Şti.</strong> tarafından 6563 sayılı
              Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat kapsamında hazırlanmıştır.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">2. Ticari İletişim İzni</h2>
            <p>
              Trink Makina platformunda form doldururken ticari ileti onayı vermeniz halinde Varmak Makine;
              telefon, SMS, e-posta ve diğer elektronik kanallar aracılığıyla size aşağıdaki içerikleri iletebilir:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Makine alım-satım fırsatları ve kampanyaları</li>
              <li>Yeni hizmetler ve platform güncellemeleri</li>
              <li>Sektörel haberler ve içerikler</li>
              <li>Özel teklifler ve fiyat bildirimleri</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. İznin Geri Alınması</h2>
            <p>
              Ticari ileti iznini dilediğiniz zaman geri alabilirsiniz. Bunun için:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gelen e-postalardaki "Abonelikten çık" bağlantısını tıklayabilirsiniz.</li>
              <li><strong>info@trinkmakina.com</strong> adresine "Ticari İleti İznini Geri Al" konusuyla e-posta gönderebilirsiniz.</li>
              <li>0850 XXX XX XX numaralı hattı arayabilirsiniz.</li>
            </ul>
            <p className="mt-2">
              Talebiniz en geç 3 iş günü içinde işleme alınır.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. Kayıt</h2>
            <p>
              Verilen izinler, yasal zorunluluk gereği İleti Yönetim Sistemi (İYS) üzerinde kayıt altına alınır.
              İYS üzerinden de izin durumunuzu görüntüleyebilir ve değiştirebilirsiniz: <strong>iys.org.tr</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
