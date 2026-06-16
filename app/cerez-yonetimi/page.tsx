export default function CerezYonetimiPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-[#2C3E50] mb-2">Çerez Yönetimi</h1>
        <p className="text-sm text-gray-400 mb-8">Son güncelleme: Nisan 2026</p>

        <div className="card space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 mb-2">1. Çerez Nedir?</h2>
            <p>
              Çerezler, ziyaret ettiğiniz web sitesi tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.
              Trink Makina platformu (<strong>Varmak Makine Alım Satım Hizmetleri Ltd. Şti.</strong>) bu politikada
              açıklanan amaçlarla çerez kullanmaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">2. Kullandığımız Çerez Türleri</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800">Zorunlu Çerezler</p>
                <p>Platformun temel işlevselliği için gereklidir. Bu çerezler devre dışı bırakılamaz.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">İşlevsel Çerezler</p>
                <p>Form tercihlerinizi ve oturum bilgilerinizi hatırlamak için kullanılır.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Analitik Çerezler</p>
                <p>Platformun nasıl kullanıldığını anlamamıza yardımcı olur (sayfa görüntülenme, tıklama verileri vb.).
                Bu veriler anonim olarak işlenir.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Pazarlama Çerezleri</p>
                <p>Açık rızanız bulunması halinde, ilgi alanlarınıza yönelik reklamlar göstermek için kullanılır.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
            <p>
              Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezlerin
              engellenmesi platforma erişimi olumsuz etkileyebilir.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
              <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
              <li>Safari: Tercihler → Gizlilik → Çerezler</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. İletişim</h2>
            <p>
              Çerez politikamıza ilişkin sorularınız için <strong>info@trinkmakina.com</strong> adresine
              ulaşabilirsiniz.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
