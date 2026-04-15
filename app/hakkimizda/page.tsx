import { Container } from "@/components/layout/Container";

export default function AboutPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-slate-900">Hakkımızda</h1>
      <div className="mt-6 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Guvenilir Hukuki Rehberlik</h2>
          <p className="mt-3">
            hukukportali.com, aile hukuku ve miras surecleri gibi hayatin en kritik donemlerinde
            dogru bilgiye erisimi saglamak amaciyla kurulmus profesyonel bir icerik platformudur.
            Tum yayin sureclerimiz ve hukuki analizlerimiz, Avukat Ceren Sumer Cilli&apos;nin
            uzmanligi ve denetimiyle sekillenmektedir.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Uzmanlik Alanlarimiz ve Vizyonumuz</h2>
          <p className="mt-3">
            Hukuk dunyasindaki guncel degisimleri (ozellikle 2026 yilindaki yeni ictihatlari)
            yakindan takip ederek, karmasik yasal surecleri herkes icin seffaf hale getiriyoruz.
            Platformumuz, teknik bilginin otesinde, hukuki sorunlarin insani boyutunu da onemseyen
            bir yaklasimi benimser.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Avukat Ceren Sumer Cilli Hakkinda</h2>
          <p className="mt-3">
            Adana Barosu&apos;na kayitli olarak avukatlik meslegini surduren Ceren Sumer Cilli,
            ozellikle aile ve miras hukuku alanindaki derin tecrubesiyle taninmaktadir. Akademik
            bilgi ile pratik saha tecrubesini birlestiren Ceren Sumer Cilli, asagidaki alanlarda
            uzmanlasmis bir hukukcudur:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Aile Hukuku ve Bosanma Davalari:</strong> Cekismeli ve anlasmali bosanma
              sureclerinin yonetimi, velayet ve nafaka uyusmazliklari.
            </li>
            <li>
              <strong>Mal Paylasimi ve Miras:</strong> Evlilik birligi icerisindeki mal rejiminin
              tasfiyesi, miras paylasimlari ve vasiyetname duzenlemeleri.
            </li>
            <li>
              <strong>Ortakligin Giderilmesi (Izale-i Suyu):</strong> Tasinmaz mallar uzerindeki
              ortakligin hukuki yollarla cozume kavusturulmasi.
            </li>
            <li>
              <strong>Bosanma Arabuluculugu:</strong> Taraflar arasindaki uyusmazliklarin mahkeme
              oncesi cozumunde profesyonel rehberlik ve uzlasma yonetimi.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Neden Bizi Takip Etmelisiniz?</h2>
          <p className="mt-3">
            Hukuk Portali&apos;ndaki her icerik, Yargitay 2. Hukuk Dairesi (Aile Hukuku) gibi yuksek
            mahkemelerin en guncel kararlari isiginda hazirlanir. Ceren Sumer Cilli&apos;nin
            editorlugunde; mulkiyet haklarindan aile ici huzurun korunmasina kadar her konuda
            guvenilir, tarafsiz ve guncel bilgiye ulasmaniz hedeflenir.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">
            SEO ve Otoriteyi Ucuracak 3 Kritik Tavsiye (Cursor Icin)
          </h2>
          <p className="mt-3">
            Ceren Hanim&apos;in isminin Google&apos;da bu anahtar kelimelerle eslesmesi icin Cursor
            uzerinden su teknik adimlari atmani oneririm:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>
              <strong>Keyword Clustering:</strong> Sitedeki &quot;Rehber&quot; kategorisinin altina
              &quot;Bosanma Davasi Rehberi&quot;, &quot;Miras Paylasimi Hesaplama&quot; ve
              &quot;Anlasmali Bosanma Protokolu&quot; gibi spesifik alt kategoriler acip icerikleri
              buraya topla.
            </li>
            <li>
              <strong>Schema.org &quot;ProfessionalService&quot; Guncellemesi:</strong> Cursor&apos;a
              su komutu ver: &quot;Hakkimizda sayfasina JSON-LD formatinda bir Schema ekle. Avukat
              Ceren Sumer Cilli&apos;yi &apos;Person&apos; olarak, uzmanlik alanlarini (knowsAbout) ise
              &apos;Family Law, Inheritance Law, Divorce Mediation&apos; olarak tanimla.&quot;
            </li>
            <li>
              <strong>Local SEO (Adana Vurgusu):</strong> Madem Adana&apos;dayiz, metinlerin icinde
              veya footer kisminda &quot;Adana Bosanma Davalari&quot; veya &quot;Adana Miras Hukuku
              Uzmani&quot; gibi yerel vurgulari dogal bir sekilde gecir. Google, yerel aramalarda
              (Adana&apos;daki biri arama yaptiginda) sizi cok daha ustte cikaracaktir.
            </li>
          </ol>
        </section>
      </div>
    </Container>
  );
}
