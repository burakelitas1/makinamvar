export default function KVKKPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-[#2C3E50] mb-2">Kişisel Verilerin Korunması</h1>
        <p className="text-sm text-gray-400 mb-8">Son güncelleme: Nisan 2026</p>

        <div className="card space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 mb-2">1. Veri Sorumlusu</h2>
            <p>
              Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında
              <strong> Varmak Makine Alım Satım Hizmetleri Ltd. Şti.</strong> ("Varmak Makine" veya "Şirket")
              tarafından hazırlanmıştır. Trink Makina platformu Varmak Makine'ye ait olup Şirket, veri sorumlusu
              sıfatıyla hareket etmektedir.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">2. İşlenen Kişisel Veriler</h2>
            <p>Platformumuz üzerinden topladığımız kişisel veriler şunlardır:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ad, soyad</li>
              <li>Cep telefonu numarası</li>
              <li>E-posta adresi</li>
              <li>İl ve ilçe bilgisi</li>
              <li>Satışa sunulan makineye ait bilgiler (marka, model, yıl, kapasite, durum, satış nedeni)</li>
              <li>Makineye ait fotoğraflar ve görsel içerikler</li>
              <li>Form gönderim tarihi ve IP adresi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Makine satış teklifinin hazırlanması ve tarafınıza iletilmesi</li>
              <li>Satın alma sürecinin yürütülmesi</li>
              <li>Müşteri ilişkilerinin yönetimi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin iyileştirilmesi ve istatistiksel analizler</li>
              <li>Açık rızanız bulunması halinde ticari elektronik ileti gönderimi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. İçerik ve Fotoğraf Hakları</h2>
            <p>
              Platforma yüklediğiniz fotoğraflar, görseller ve makineye ilişkin tüm içerikler; Varmak Makine'ye
              teklif sürecinin yürütülmesi, platform tanıtımı, sosyal medya paylaşımları ve pazarlama
              faaliyetleri amacıyla kullanılmak üzere <strong>münhasır olmayan, süresiz, telif ücretsiz bir
              lisansla</strong> Varmak Makine'ye devredilmiş sayılır. Bu devir, formun gönderilmesiyle birlikte
              gerçekleşir.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">5. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz; iş ortaklarımız, hizmet sağlayıcılarımız (bulut altyapısı, e-posta servisi),
              yetkili kamu kurumları ve yargı mercileriyle KVKK'nın öngördüğü koşullarda paylaşılabilir.
              Yurt dışı aktarım söz konusu olduğunda gerekli güvenceler sağlanır.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">6. Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, hizmetin sunulması için gerekli olan süre boyunca ve akabinde yasal
              saklama yükümlülükleri kapsamında saklanır. Satış süreci tamamlanmayan başvuruların verileri
              3 yıl süreyle muhafaza edilir.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">7. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş ise düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>İşlemenin otomatik sistemler aracılığıyla yapılması halinde aleyhinize sonuç doğurmasına itiraz etme</li>
              <li>Zararın tazminini talep etme</li>
            </ul>
            <p className="mt-2">
              Haklarınızı kullanmak için <strong>info@trinkmakina.com</strong> adresine yazılı başvuruda bulunabilirsiniz.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
