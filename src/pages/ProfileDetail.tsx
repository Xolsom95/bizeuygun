import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Wallet,
  Briefcase,
  Heart,
  Baby,
  Dog,
  Building,
  MessageSquare,
  ArrowLeft,
  Shield,
  Calendar,
  User,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Same mock data (in production, fetch from DB)
const mockProfiles: Record<string, any> = {
  "1": {
    id: "1",
    name: "Ahmet Yılmaz",
    age: 32,
    job: "Yazılım Mühendisi",
    company: "TechCorp",
    city: "İstanbul",
    district: "Kadıköy",
    budget: "12.000 - 18.000 ₺",
    category: "kiralik-ev",
    maritalStatus: "Evli",
    hasChildren: true,
    childrenCount: 2,
    hasPet: false,
    preferences: ["3+1", "Asansörlü", "Otoparklı", "Balkonlu", "Doğalgaz", "Site içi"],
    description:
      "Merhaba, 2 çocuklu bir aileyiz. 5 yıldır İstanbul'da yaşıyoruz. Yazılım mühendisi olarak çalışıyorum ve düzenli bir gelirim var. Güvenli ve sakin bir mahallede, okula yakın bir daire arıyoruz. Referanslarımız mevcuttur. Sigara kullanmıyoruz, temiz ve düzenli bir aile olarak yaşıyoruz.",
    avatar: "AY",
    createdAt: "2 gün önce",
    verified: true,
    education: "Bilgisayar Mühendisliği, İTÜ",
    income: "Aylık 45.000 ₺+",
    movingDate: "1 ay içinde",
    references: true,
  },
  "2": {
    id: "2",
    name: "Elif Kaya",
    age: 28,
    job: "Grafik Tasarımcı",
    company: "Freelance",
    city: "İstanbul",
    district: "Beşiktaş",
    budget: "8.000 - 12.000 ₺",
    category: "kiralik-ev",
    maritalStatus: "Bekar",
    hasChildren: false,
    hasPet: true,
    petType: "Kedi",
    preferences: ["2+1", "Evcil hayvan dostu", "Metro yakını", "Aydınlık"],
    description:
      "Freelance grafik tasarımcıyım, evden çalışıyorum. 3 yaşında bir kedim var, çok sakin ve temiz. Sigara içmiyorum. Sakin ve düzenli bir kiracıyım. İstanbul'da 6 yıldır yaşıyorum.",
    avatar: "EK",
    createdAt: "5 saat önce",
    verified: true,
    education: "Güzel Sanatlar, Mimar Sinan",
    income: "Aylık 25.000 ₺+",
    movingDate: "Hemen",
    references: true,
  },
};

const ProfileDetail = () => {
  const { id } = useParams();
  const profile = mockProfiles[id || "1"];

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Profil Bulunamadı</h1>
          <Link to="/">
            <Button variant="hero" className="mt-4">Ana Sayfa</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/ara/kiralik-ev" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile Header */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-bold text-accent">
                    {profile.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                      {profile.verified && (
                        <Badge className="bg-success/10 text-success border-0">
                          <Shield className="mr-1 h-3 w-3" /> Doğrulanmış
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{profile.age} yaş · {profile.city}, {profile.district}</p>
                  </div>
                </div>
                <Button variant="hero" size="lg" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mesaj Gönder
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Hakkında</h2>
              <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
            </div>

            {/* Preferences */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Aranan Özellikler</h2>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.map((pref: string) => (
                  <Badge key={pref} variant="outline" className="px-3 py-1.5 text-sm">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Budget */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display font-semibold text-foreground">Bütçe</h3>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-accent">{profile.budget}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.category === "kiralik-ev" ? "Aylık kira bütçesi" : "Toplam bütçe"}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display font-semibold text-foreground">Detaylar</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" /> Meslek
                  </span>
                  <span className="font-medium text-foreground">{profile.job}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" /> Şirket
                  </span>
                  <span className="font-medium text-foreground">{profile.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" /> Medeni Hal
                  </span>
                  <span className="font-medium text-foreground">{profile.maritalStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Baby className="h-4 w-4" /> Çocuk
                  </span>
                  <span className="font-medium text-foreground">
                    {profile.hasChildren ? `${profile.childrenCount || "Var"}` : "Yok"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Dog className="h-4 w-4" /> Evcil Hayvan
                  </span>
                  <span className="font-medium text-foreground">
                    {profile.hasPet ? profile.petType || "Var" : "Yok"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" /> Gelir
                  </span>
                  <span className="font-medium text-foreground">{profile.income}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Taşınma
                  </span>
                  <span className="font-medium text-foreground">{profile.movingDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" /> Referans
                  </span>
                  <span className="font-medium text-foreground">
                    {profile.references ? "Mevcut" : "Yok"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl bg-gradient-accent p-6 text-center text-accent-foreground">
              <h3 className="mb-2 font-display font-semibold">İletişime Geç</h3>
              <p className="mb-4 text-sm text-accent-foreground/80">
                Bu kişiyle mesajlaşmak için giriş yapın
              </p>
              <Link to="/giris">
                <Button variant="hero-outline" className="w-full border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileDetail;
