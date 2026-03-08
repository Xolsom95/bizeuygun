import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Building2, Car, ArrowRight, Search, UserCheck, MessageSquare, Shield, Users, TrendingUp } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categories = [
  {
    title: "Kiralık Ev Arayanlar",
    description: "Bütçe, konum ve ev tercihleriyle kiracı profilleri",
    icon: Home,
    to: "/ara/kiralik-ev",
    count: 2847,
  },
  {
    title: "Satılık Ev Arayanlar",
    description: "Hayalindeki evi tarif eden alıcı profilleri",
    icon: Building2,
    to: "/ara/satilik-ev",
    count: 1523,
  },
  {
    title: "Araç Arayanlar",
    description: "Araç tipi, bütçe ve marka tercihli alıcı profilleri",
    icon: Car,
    to: "/ara/arac",
    count: 3291,
  },
];

const steps = [
  {
    step: "1",
    title: "Profilini Oluştur",
    description: "Ne aradığını, bütçeni ve kişisel bilgilerini içeren CV'ni oluştur.",
    icon: Users,
  },
  {
    step: "2",
    title: "İlanını Yayınla",
    description: "Profilini yayınla ve satıcı/ev sahiplerinin seni bulmasını bekle.",
    icon: Search,
  },
  {
    step: "3",
    title: "Teklif Al",
    description: "Kriterlerine uyan satıcılar sana ulaşsın, tekliflerini değerlendir.",
    icon: MessageSquare,
  },
];

const stats = [
  { value: "7.600+", label: "Aktif Profil" },
  { value: "15.000+", label: "Başarılı Eşleşme" },
  { value: "50+", label: "Şehir" },
  { value: "%94", label: "Memnuniyet" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-foreground/90">
                <TrendingUp className="h-4 w-4" />
                Türkiye'nin ilk ters ilan platformu
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
                Artık İlanı{" "}
                <span className="text-accent">Alıcı</span> Verir,{" "}
                <span className="text-accent">Satıcı</span> Bulur.
              </h1>
              <p className="mb-8 max-w-lg text-lg text-primary-foreground/75">
                Ev mi arıyorsun? Araba mı? Profilini oluştur, bütçeni ve kriterlerini belirle.
                Satıcılar ve ev sahipleri seni bulsun.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/profil-olustur">
                  <Button variant="hero" size="lg" className="gap-2">
                    Hemen CV Oluştur
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/nasil-calisir">
                  <Button variant="hero-outline" size="lg">
                    Nasıl Çalışır?
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src={heroIllustration}
                alt="BulBeni ters ilan platformu illüstrasyonu"
                className="w-full max-w-lg mx-auto animate-float"
              />
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="hsl(220, 20%, 97%)"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-card p-6 text-center shadow-card"
              >
                <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
              Kategorilere Göz At
            </h2>
            <p className="text-muted-foreground">
              Kriterlerine uygun alıcı ve kiracı profillerini keşfet
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Link to={cat.to}>
                    <div className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                        {cat.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">{cat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-accent">
                          {cat.count.toLocaleString("tr-TR")} aktif profil
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
              Nasıl Çalışır?
            </h2>
            <p className="text-muted-foreground">3 adımda aradığını bul</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent text-accent-foreground shadow-accent-glow">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-6xl font-bold text-muted/50">
                    {step.step}
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-hero p-8 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
                  Güvenli ve Şeffaf Platform
                </h2>
                <p className="mb-6 text-primary-foreground/75">
                  Tüm profiller doğrulanır. Güvenli mesajlaşma ile iletişim kurun.
                  Kişisel bilgileriniz korunur.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Shield, text: "Kimlik doğrulama sistemi" },
                    { icon: UserCheck, text: "Profil onay süreci" },
                    { icon: MessageSquare, text: "Platform içi güvenli mesajlaşma" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3 text-primary-foreground/90">
                        <Icon className="h-5 w-5 text-accent" />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <Link to="/profil-olustur">
                  <Button variant="hero" size="lg" className="gap-2">
                    Ücretsiz Başla
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
