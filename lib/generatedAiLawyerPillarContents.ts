/**
 * Avukatlar için yapay zekâ kümesi: ana hub + iki pillar makale gövdesi.
 * (generatedPostContents.ts boyutunu şişirmemek için ayrı dosya.)
 */
export const aiLawyerPillarContents: Record<string, string> = {
  "avukatlar-icin-yapay-zeka-hukuk-rehberi": `# Avukatlar İçin Yapay Zekâ: Hukuki Çerçeve, Riskler ve Uygulama Rehberi

Yapay zekâ araçları; hukuki araştırma, dilekçe taslağı, özet çıkarma ve müvekkil iletişiminde hız kazandırsa da avukat için asıl mesele “hız” değil **mesleki özen**, **vekâlet görevi** ve **hukuki doğruluk** standardının korunmasıdır. Bu rehber; ofis içi kullanım, delil ve ispat, kişisel veri ile mesleki sır, meslek etiği ve yargı süreçlerinde dikkat edilmesi gereken başlıkları **genel hukuki bilgilendirme** çerçevesinde bir araya getirir.

## Avukatlık mesleğinde yapay zekânın yeri

Yapay zekâ çıktıları tek başına **hukuki danışmanlık** veya **mahkemede savunma** yerine geçmez. Avukat; araçtan gelen metni kendi mesleki bilgisiyle denetlemek, mevzuat ve somut olguya oturtmak, delilleri değerlendirmek ve stratejiyi belirlemekle yükümlüdür. Bu nedenle “taslak üretildi” aşaması, dosyanın bittiği anlamına gelmemelidir.

| Aşama | Avukatın rolü |
| :---- | :------------ |
| Araştırma | Kaynakların güvenilirliğini ve güncelliğini teyit etmek |
| Taslak metin | Usul, delil ve olay örgüsüyle uyumu kontrol etmek |
| Müvekkil iletişimi | Gizlilik ve onay süreçlerini yönetmek |
| Yargı sunumu | İddia–savunma bütünlüğünü ve etik sınırları korumak |

## Sık görülen riskler (özet)

- **Doğrulanmamış içtihat veya mevzuat atfı:** Model çıktıları bazen yanlış veya eksik atıf içerebilir; resmi kaynakla teyit edilmeden kullanılmamalıdır.
- **Kişisel veri ve mesleki sır:** Müvekkile ait bilgilerin üçüncü taraf araçlara aktarımı ayrı bir hukuki değerlendirme gerektirir.
- **Gizlilik ve güvenlik:** Ofis içi politika, erişim logları ve personel eğitimi birlikte planlanmalıdır.
- **Otomasyon illüzyonu:** “Hızlı sonuç” algısı, usul hatalarına ve geri dönüşü zor düzeltmelere yol açabilir.

## Ofiste politika oluşturmak

Küçük büro veya büyük ekip fark etmeksizin yazılı bir **Yapay Zekâ Kullanım Politikası**; hangi verinin hangi araçla paylaşılabileceğini, hangi işlerin mutlaka insan onayından geçeceğini ve hangi dosyalarda araç kullanılmayacağını netleştirir. Politika; yalnızca IT değil, **meslek kuralları** ve **temsil sorumluluğu** ile uyumlu olmalıdır.

## İçtihat ve mevzuat araştırmasında dikkat

Araştırma asistanı olarak kullanılan sistemler; başlangıç notu veya hipotez üretiminde yardımcı olabilir. Nihai hukuki kanaat için **resmî mevzuat metinleri**, güvenilir veri tabanları ve gerektiğinde bilirkişi/uzman görüşü ayrı değerlendirilmelidir.

## Pillar okumalar: derinlemesine başlıklar

Bu hub makalesini tamamlayan iki içerik, uygulamada en çok tartışılan başlıklara ayrılmıştır:

1. **[Yapay zekâ çıktıları, meslekî sırrın korunması ve kişisel veri](/analizler/yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri)** — veri minimizasyonu, amaç sınırı ve vekâlet ilişkisinde gizlilik dengesi.
2. **[Dilekçe ve araştırmada yapay zekâ: avukat kontrol listesi](/rehber/dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi)** — taslağı dosyaya bağlama, delil listesi ve usul kontrolleri için pratik adımlar.

İlgili bağlam için sitedeki diğer içeriklere de göz atabilirsiniz: [Yapay zekâ ve avukatın hukuki sorumluluğu](/analizler/yapay-zeka-avukat-sorumlulugu), [Yapay zekâ destekli dilekçe tartışması](/haber/yapay-zeka-avukatsiz-dava-dilekcesi).

## Sonuç

Yapay zekâ; avukatlıkta “yardımcı motor” olarak konumlandığında fayda üretir. Ancak **nihai mesleki karar** ve **hukuki sorumluluk** avukatta kalır. Bu standart, hem müvekkil güvenini hem de yargı nezdindeki itibarı korur.

**Bu içerik genel bilgilendirme niteliğindedir; somut olay ve mevzuat uygulaması için ayrı hukuki değerlendirme gerekir.**`,

  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri": `# Yapay Zekâ Çıktıları: Meslekî Sır, Kişisel Veri ve Baro Perspektifinden Genel Çerçeve

Avukat–müvekkil ilişkisi; güven, gizlilik ve tarafsız temsil ilkeleri üzerinden yürür. Yapay zekâ araçlarına dosya bilgisi veya iletişim içeriği aktarımı gündeme geldiğinde tartışma genelde iki eksende yoğunlaşır: **meslekî sırrın korunması** ve **kişisel verilerin işlenmesi**. Bu analiz, kesin düzenleme iddiası olmadan, uygulamada sık kullanılan bir **genel hukuki değerlendirme** sunar.

## Meslekî sırrın korunması neden kritik?

Meslekî sırrın ihlali; vekâlet güvenini zedeler, müvekkilin hukuki durumunu riske atar ve meslek etiği açısından ağır sonuçlar doğurabilecek bir başlıktır. Bu nedenle üçüncü taraf yazılımlara aktarılacak verinin kapsamı **daraltılmalı**, gereksiz belge ve tam metin yüklemelerinden kaçınılmalıdır.

| Veri türü | Paylaşım öncesi sorulacak soru |
| :-------- | :----------------------------- |
| Kimlik ve iletişim | Müvekkil bilgisi mi, minimizasyon mümkün mü? |
| Finans / özel hayat | İşleme amacı net mi? |
| Dava stratejisi notları | Meslekî sıra sınırında mı? |
| Mahkeme dosyası tamamı | Gerçekten gerekli mi? |

## Kişisel veri boyutu

Kişisel verilerin işlenmesinde **amaç sınırı**, **süre** ve **güvenlik** başlıkları öne çıkar. Avukatlık organizasyonunda; erişim yetkileri, alt işveren (alt hizmet sağlayıcı) sözleşmeleri ve personel eğitimi bir bütün olarak ele alınmalıdır. Somut uyum projesi, her ofisin iş modeline göre değişir.

## “Anonimleştirme” gerçekten yeterli mi?

Bazı ekipler, dosyayı “anonim” sanarak yükleme yapar. Oysa bağlam yeterince zengin olduğunda **yeniden tanımlama riski** doğabilir. Bu nedenle anonimleştirme kararı tek başına riski sıfırlamaz; veri minimizasyonu ve süreç tasarımı birlikte düşünülmelidir.

## Yapay zekâ çıktısının hukuki statüsü

Üretilen metnin telif, içerik doğruluğu ve mahkemede kullanımına ilişkin sorular dosya türüne göre değişir. Önemli olan; çıktının **avukatın mesleki denetiminden** geçtiğinin dosyada izlenebilir olması ve iddia–delil zincirinin bozulmamasıdır.

## Hub ile bağlantı

Bu başlıkları bütünsel olarak ele alan ana çerçeve için bkz. [Avukatlar için yapay zekâ hukuk rehberi](/rehber/avukatlar-icin-yapay-zeka-hukuk-rehberi). Pratik kontrol adımları için bkz. [Dilekçe ve araştırmada yapay zekâ kontrol listesi](/rehber/dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi).

## Sonuç

Yapay zekâ; verimlilik sağlayabilir ancak **gizlilik ve meslekî sırrın korunması** başlığında “tek tıkla yükle” pratiği risklidir. Ofis içi politika, sözleşme ve eğitim üçlüsü olmadan araç kullanımı genişletildiğinde, ihlal iddiaları ve itibar kaybı olasılığı artar.

**Bu içerik genel bilgilendirme niteliğindedir; somut olay ve mevzuat uygulaması için ayrı hukuki değerlendirme gerekir.**`,

  "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi": `# Dilekçe ve Araştırmada Yapay Zekâ: Avukat Kontrol Listesi

Bu rehber; yapay zekâ ile üretilen taslakların dilekçe ve hukuki araştırma sürecine güvenli biçimde bağlanması için **pratik bir kontrol listesi** sunar. Amaç, hız kazanırken usul, delil ve meslek etiği sınırlarını korumaktır.

## 1) Olay ve talep uyumu

- Olay tarihleri, taraflar ve merci bilgisi taslakta doğru mu?
- Talepler, dilekçe türüne göre **usulen mümkün** mü?
- Karşı taraf sıfatı ve görevli mahkeme zinciri tutarlı mı?

## 2) Delil ve hukuki dayanak

- Atılan mevzuat maddeleri güncel metinle uyumlu mu (resmî kaynak kontrolü)?
- Delil listesi, iddia örgüsünü **gerçekten** destekliyor mu?
- “Varsayımsal” içtihat veya örnek karar metni varsa çıkarıldı mı?

## 3) Dil, üslup ve etik

- Müvekkile ait özel bilgi gereksiz yere yazılmamış mı?
- Hakaret, aşırı iddia veya yanıltıcı kesinlik ifadeleri temizlendi mi?
- Karşı taraf ve üçüncü kişiler için **ölçülü** üslup korunuyor mu?

## 4) Üretim izi ve ofis standardı

Küçük bir iç disiplin, ileride oluşabilecek tartışmalarda faydalıdır:

| Kayıt | Örnek uygulama |
| :---- | :-------------- |
| Versiyon | Taslak sürümlerinin tarihlenmesi |
| Kaynak | Araştırma notlarının linklenmesi |
| Onay | Son metni onaylayan avukatın netliği |
| Araç politikası | Hangi veri sınıfının hangi araca gideceği |

## 5) Sunum ve revizyon

- Duruşma / celse takvimine göre süreler kontrol edildi mi?
- Ek dilekçe veya ek belge ihtiyacı ayrıca planlandı mı?
- Ekinde sunulan PDF’lerin bütünlüğü ve sırası doğru mu?

## Hub ve geniş çerçeve

Veri ve sırlılık boyutu için bkz. [Yapay zekâ çıktıları: meslekî sırrın korunması ve kişisel veri](/analizler/yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri). Genel çerçeve için bkz. [Avukatlar için yapay zekâ hukuk rehberi](/rehber/avukatlar-icin-yapay-zeka-hukuk-rehberi).

## Sonuç

Yapay zekâ; “ilk taslak” aşamasında zaman kazandırabilir. Ancak dilekçenin **nihai sorumluluğu** avukattadır. Kontrol listesi disiplini, hem dosya kalitesini artırır hem de mesleki riskleri düşürür.

**Bu içerik genel bilgilendirme niteliğindedir; somut olay ve mevzuat uygulaması için ayrı hukuki değerlendirme gerekir.**`
};
