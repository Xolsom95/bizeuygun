import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users, Search, MessageSquare, CheckCircle, ArrowRight,
  UserPlus, FileText, Bell, Handshake, Shield, Eye, Star
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const buyerSteps = [
  {
    icon: UserPlus,
    title: "Ücretsiz Kayıt Ol",
    description: "E-posta adresinle hızlıca kayıt ol. Kimlik doğrulama ile güvenilirliğini artır.",
  },
  {
    icon: FileText,
    title: "CV'ni Oluştur",
    description: "Ne aradığını, bütçeni, kişisel bilgilerini ve tercihlerini detaylı şekilde belirt.",
  },
  {
    icon: Eye,
    title: "Profilini Yayınla",
    description: "CV'ni yayınla ve satıcılar/ev sahipleri tarafından keşfedilmeyi bekle.",
  },
  {
    icon: Bell,
    title: "Teklif Al",
    description: "Kriterlerine uygun satıcılardan mesaj ve teklif al. Bildirimleri takip et.",
  },
  {
    icon: Handshake,
    title: "Anlaşmaya Var",
    description: "Beğendiğin teklifle iletişime geç, görüşmeyi tamamla ve anlaş.",
  },
];

const sellerSteps = [
  {
    icon: Search,
    title: "Profilleri İncele",
    description: "Kategorilere göz at, filtreleri kullan ve kriterlerine uygun alıcıları bul.",
  },
  {
    icon: Star,
    title: "En Uygun Adayı Seç",
    description: "CV'leri incele, bütçe, konum ve tercihleri karşılaştır.",
  },
  {
    icon: MessageSquare,
    title: "İletişime Geç",
    description: "Beğendiğin profile mesaj gönder, teklifini sun ve görüşme ayarla.",
  },
];

const faqs = [
  {
    q: "BulBeni ücretsiz mi?",
    a: "Profil oluşturmak tamamen ücretsiz. Öne çıkma ve premium özellikler için paketlerimizi inceleyebilirsiniz.",
  },
  {
    q: "Bilgilerim güvende mi?",
    a: "Evet, tüm veriler şifrelenerek saklanır. Kişisel bilgileriniz yalnızca onayladığınız kişilerle paylaşılır.",
  },
  {
    q: "Satıcı/ev sahibi olarak nasıl kullanırım?",
    a: "Kayıt olun, kategorilere göz atın, kriterlerinize uyan profilleri filtreleyin ve mesaj gönderin.",
  },
  {
    q: "Birden fazla profil oluşturabilir miyim?",
    a: "Evet, farklı kategorilerde birden fazla arama profili oluşturabilirsiniz.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
          >
            Nasıl <span className="text-accent">Çalışır?</span>
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75">
            Geleneksel ilan sitelerinin aksine, burada arayan kişi CV'sini yayınlar,
            satıcı onu bulur. İşte adım adım süreç.
          </p>
        </div>
      </section>

      {/* Buyer Flow */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
              Arayan (Alıcı / Kiracı) İçin
            </h2>
            <p className="text-muted-foreground">Aradığın şeyi tanımla, teklifleri bekle</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {buyerSteps.map((step, i) => {
                const Icon = step.icon;
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-4 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <div className="rounded-2xl bg-card p-6 shadow-card inline-block max-w-md">
                        <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-accent-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Seller Flow */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
              Satan / Kiralayan İçin
            </h2>
            <p className="text-muted-foreground">En uygun alıcıyı bul, teklifini sun</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {sellerSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-2xl bg-background p-8 text-center shadow-card"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">
            Sıkça Sorulan Sorular
          </h2>
          <div className="mx-auto max-w-2xl space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-card p-6 shadow-card"
              >
                <h3 className="mb-2 font-display font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
            Hemen Başla!
          </h2>
          <p className="mb-6 text-primary-foreground/75">CV'ni oluştur ve teklifleri beklemeye başla</p>
          <Link to="/profil-olustur">
            <Button variant="hero" size="lg" className="gap-2">
              Ücretsiz CV Oluştur <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
