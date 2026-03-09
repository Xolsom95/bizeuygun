import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const sections = [
  {
    title: "1. Toplanan Veriler",
    content: "BizeUygun olarak, profil oluşturma sürecinde sağladığınız kişisel bilgileri (ad soyad, yaş, meslek, medeni hal, bütçe tercihleri vb.) toplarız. Ayrıca site kullanımınıza ilişkin anonim istatistiksel veriler toplanabilir.",
  },
  {
    title: "2. Verilerin Kullanımı",
    content: "Toplanan veriler, profilinizi oluşturmak, size uygun eşleşmeler sunmak, platform deneyiminizi iyileştirmek ve güvenlik önlemleri almak amacıyla kullanılır. Verileriniz pazarlama amacıyla üçüncü taraflarla paylaşılmaz.",
  },
  {
    title: "3. Veri Güvenliği",
    content: "Tüm kişisel verileriniz şifrelenerek saklanır. SSL sertifikası ile korunan güvenli bağlantılar kullanılır. Düzenli güvenlik denetimleri yapılır ve en güncel güvenlik standartları uygulanır.",
  },
  {
    title: "4. Çerezler (Cookies)",
    content: "Sitemizde oturum yönetimi ve kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.",
  },
  {
    title: "5. Üçüncü Taraf Hizmetler",
    content: "Analitik ve performans ölçümü için üçüncü taraf hizmetler kullanılabilir. Bu hizmetler, yalnızca anonim ve toplu verilerle çalışır.",
  },
  {
    title: "6. Kullanıcı Hakları",
    content: "KVKK kapsamında kişisel verilerinize erişim, düzeltme, silme ve taşıma haklarına sahipsiniz. Bu haklarınızı kullanmak için destek@bizeuygun.com adresine başvurabilirsiniz.",
  },
  {
    title: "7. Veri Saklama Süresi",
    content: "Kişisel verileriniz, hesabınız aktif olduğu sürece saklanır. Hesap silinmesi durumunda, verileriniz yasal zorunluluklar dışında 30 gün içinde kalıcı olarak silinir.",
  },
  {
    title: "8. Değişiklikler",
    content: "Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler e-posta ile bildirilir. Platformu kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Gizlilik Politikası" description="BizeUygun gizlilik politikası. Kişisel verilerinizin nasıl korunduğunu öğrenin." path="/gizlilik" />
      <Navbar />

      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
          >
            Gizlilik Politikası
          </motion.h1>
          <p className="text-primary-foreground/75">Son güncelleme: Mart 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h2 className="mb-3 font-display text-xl font-bold text-foreground">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
