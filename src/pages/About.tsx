import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Users, Shield, Heart, ArrowRight, Globe, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const values = [
  { icon: Shield, title: "Güvenlik", desc: "Tüm profiller doğrulanır. Kişisel verileriniz korunur." },
  { icon: Heart, title: "Şeffaflık", desc: "Gizli ücret yok. Süreçler açık ve net." },
  { icon: Users, title: "Topluluk", desc: "Binlerce arayan ve satan, tek platformda buluşur." },
  { icon: Zap, title: "Hız", desc: "Doğru eşleşme saniyeler içinde. Zaman kaybı yok." },
];

const founder = { name: "Mehmet Samet Dalgıç", role: "Kurucu & CEO", avatar: "MSD" };

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Hakkımızda" description="BizeUygun, geleneksel ilan anlayışını tersine çeviren Türkiye'nin ilk ters ilan platformudur." path="/hakkimizda" />
      <Navbar />

      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
          >
            Hakkımızda
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75">
            BizeUygun, geleneksel ilan anlayışını tersine çeviren Türkiye'nin ilk ters ilan platformudur.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Misyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ev, araç veya hizmet arayan insanların güçlü olduğu bir pazar yeri oluşturmak.
                Geleneksel sistemde alıcılar yüzlerce ilan arasında kaybolur. BizeUygun'da ise
                arayan kişi kriterlerini belirler, satıcı onu bulur. Doğru eşleşme, daha az
                zaman kaybı, daha mutlu insanlar.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Vizyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Türkiye'nin en büyük ters ilan platformu olarak, tüm kategorilerde
                alıcıları ve satıcıları buluşturmak. Sadece emlak ve araç değil;
                iş ilanları, ikinci el eşyalar, hizmetler ve daha fazlası.
                Herkesin aradığını bulduğu, güvenli ve şeffaf bir ekosistem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">Değerlerimiz</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-background p-6 text-center shadow-card"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">Kurucu</h2>
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-card p-8 text-center shadow-card max-w-sm w-full"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-bold text-accent">
                {founder.avatar}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{founder.name}</h3>
              <p className="text-sm text-muted-foreground">{founder.role}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "TR", label: "Türkiye Geneli" },
              { value: "4", label: "Kategori" },
              { value: "%100", label: "Ücretsiz" },
              { value: "7/24", label: "Erişim" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-accent">{s.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground">Topluluğumuza Katıl</h2>
          <p className="mb-6 text-muted-foreground">Binlerce arayan ve satan arasına sen de katıl</p>
          <Link to="/profil-olustur">
            <Button variant="hero" size="lg" className="gap-2">
              Hemen Başla <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
