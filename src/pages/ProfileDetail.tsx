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
  GraduationCap,
  Cigarette,
  Share2,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProfileById } from "@/data/mockProfiles";

const categoryLabels: Record<string, string> = {
  "kiralik-ev": "Kiralık Ev",
  "satilik-ev": "Satılık Ev",
  "arac": "Araç",
  "is-ariyorum": "İş",
  "ikinci-el": "İkinci El",
  "hizmet": "Hizmet",
};

const ProfileDetail = () => {
  const { id } = useParams();
  const profile = getProfileById(id || "1");

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Profil Bulunamadı</h1>
          <p className="mt-2 text-muted-foreground">Bu profil silinmiş veya mevcut değil.</p>
          <Link to="/">
            <Button variant="hero" className="mt-4">Ana Sayfa</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profil linki kopyalandı!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/ara/${profile.category}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {categoryLabels[profile.category] || "Geri"} Arayanlar
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Paylaş
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Flag className="h-4 w-4" /> Bildir
            </Button>
          </div>
        </div>

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                      {profile.verified && (
                        <Badge className="bg-success/10 text-success border-0">
                          <Shield className="mr-1 h-3 w-3" /> Doğrulanmış
                        </Badge>
                      )}
                      <Badge variant="outline">{categoryLabels[profile.category]} Arıyor</Badge>
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

            {/* Similar Profiles Hint */}
            <div className="rounded-2xl bg-muted/50 p-6">
              <h3 className="mb-2 font-display font-semibold text-foreground">Benzer Profiller</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Bu profile benzer daha fazla arayan görmek ister misiniz?
              </p>
              <Link to={`/ara/${profile.category}`}>
                <Button variant="outline" size="sm">Tüm Profilleri Gör</Button>
              </Link>
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
                  {profile.category === "kiralik-ev" ? "Aylık kira bütçesi" :
                   profile.category === "is-ariyorum" ? "Beklenen maaş aralığı" :
                   profile.category === "hizmet" ? "Hizmet bütçesi" : "Toplam bütçe"}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display font-semibold text-foreground">Detaylar</h3>
              <div className="space-y-3 text-sm">
                <DetailRow icon={Briefcase} label="Meslek" value={profile.job} />
                <DetailRow icon={Building} label="Şirket" value={profile.company} />
                {profile.education && <DetailRow icon={GraduationCap} label="Eğitim" value={profile.education} />}
                <DetailRow icon={Heart} label="Medeni Hal" value={profile.maritalStatus} />
                <DetailRow icon={Baby} label="Çocuk" value={profile.hasChildren ? `${profile.childrenCount || "Var"}` : "Yok"} />
                <DetailRow icon={Dog} label="Evcil Hayvan" value={profile.hasPet ? profile.petType || "Var" : "Yok"} />
                {profile.income && <DetailRow icon={Wallet} label="Gelir" value={profile.income} />}
                {profile.movingDate && <DetailRow icon={Calendar} label="Taşınma" value={profile.movingDate} />}
                {profile.references !== undefined && (
                  <DetailRow icon={User} label="Referans" value={profile.references ? "Mevcut" : "Yok"} />
                )}
                {profile.smoking !== undefined && (
                  <DetailRow icon={Cigarette} label="Sigara" value={profile.smoking ? "Evet" : "Hayır"} />
                )}
              </div>
            </div>

            {/* Contact CTA */}
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

            {/* Profile Meta */}
            <div className="rounded-xl border p-4 text-xs text-muted-foreground">
              <p>Profil oluşturulma: {profile.createdAt}</p>
              <p>Profil ID: #{profile.id}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default ProfileDetail;
