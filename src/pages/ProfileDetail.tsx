import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const categoryLabels: Record<string, string> = {
  "kiralik-ev": "Kiralık Ev",
  "satilik-ev": "Satılık Ev",
  "arac": "Satılık Araç",
  "is-ariyorum": "İş",
};

interface ListingDetail {
  id: string;
  user_id: string;
  category: string;
  city: string | null;
  district: string | null;
  budget_min: number | null;
  budget_max: number | null;
  description: string | null;
  preferences: string[] | null;
  verified: boolean | null;
  created_at: string;
  moving_date: string | null;
  experience: string | null;
}

interface ProfileData {
  name: string;
  age: number | null;
  job: string | null;
  company: string | null;
  marital_status: string | null;
  has_children: boolean | null;
  children_count: number | null;
  has_pet: boolean | null;
  pet_type: string | null;
  avatar_url: string | null;
  education: string | null;
  income: string | null;
  smoking: boolean | null;
  has_references: boolean | null;
  bio: string | null;
}

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (user === null) {
      navigate(`/giris?next=${encodeURIComponent(`/profil/${id}`)}`, { replace: true });
      return;
    }
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: listingData } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id || "")
        .maybeSingle();

      if (!listingData) {
        setLoading(false);
        return;
      }

      setListing(listingData);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, age, job, company, marital_status, has_children, children_count, has_pet, pet_type, avatar_url, education, income, smoking, has_references, bio")
        .eq("user_id", listingData.user_id)
        .maybeSingle();

      setProfile(profileData);

      const { data: favData } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listingData.id)
        .maybeSingle();
      setIsFavorited(!!favData);

      setLoading(false);
    };

    fetchData();
  }, [id, user, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profil linki kopyalandı!");
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate("/giris");
      return;
    }
    if (!listing) return;

    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setIsFavorited(false);
      toast.success("Favorilerden çıkarıldı");
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: listing.id });
      setIsFavorited(true);
      toast.success("Favorilere eklendi");
    }
  };

  const handleMessage = () => {
    if (!user) {
      navigate("/giris");
      return;
    }
    navigate("/mesajlar", { state: { receiverId: listing?.user_id } });
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Belirtilmedi";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    if (min && max) return `${fmt(min)} - ${fmt(max)} ₺`;
    if (min) return `${fmt(min)} ₺+`;
    return `${fmt(max!)} ₺'ye kadar`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing || !profile) {
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

  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const timeAgo = (() => {
    const diff = Date.now() - new Date(listing.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  })();

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${profile.name} - ${categoryLabels[listing.category]} Arıyor`} description={listing.description || `${profile.name} profili - BizeUygun`} path={`/profil/${listing.id}`} />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/ara/${listing.category}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {categoryLabels[listing.category] || "Geri"} Arayanlar
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleFavorite}>
              <Star className={`h-4 w-4 ${isFavorited ? "fill-accent text-accent" : ""}`} />
              {isFavorited ? "Favorilerde" : "Favorile"}
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Paylaş
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Flag className="h-4 w-4" /> Bildir
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-bold text-accent">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                      {listing.verified && (
                        <Badge className="bg-success/10 text-success border-0">
                          <Shield className="mr-1 h-3 w-3" /> Doğrulanmış
                        </Badge>
                      )}
                      <Badge variant="outline">{categoryLabels[listing.category]} Arıyor</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {profile.age ? `${profile.age} yaş` : ""}{listing.city ? ` · ${listing.city}` : ""}{listing.district ? `, ${listing.district}` : ""}
                    </p>
                  </div>
                </div>
                {user?.id !== listing.user_id && (
                  <Button variant="hero" size="lg" className="gap-2" onClick={handleMessage}>
                    <MessageSquare className="h-4 w-4" />
                    Mesaj Gönder
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Hakkında</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description || profile.bio || "Açıklama eklenmemiş."}</p>
            </div>

            {listing.preferences && listing.preferences.length > 0 && (
              <div className="rounded-2xl bg-card p-6 shadow-card">
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Aranan Özellikler</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.preferences.map((pref: string) => (
                    <Badge key={pref} variant="outline" className="px-3 py-1.5 text-sm">{pref}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-muted/50 p-6">
              <h3 className="mb-2 font-display font-semibold text-foreground">Benzer Profiller</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Bu profile benzer daha fazla arayan görmek ister misiniz?
              </p>
              <Link to={`/ara/${listing.category}`}>
                <Button variant="outline" size="sm">Tüm Profilleri Gör</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display font-semibold text-foreground">Bütçe</h3>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-accent">
                  {formatBudget(listing.budget_min, listing.budget_max)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {listing.category === "kiralik-ev" ? "Aylık kira bütçesi" :
                   listing.category === "is-ariyorum" ? "Beklenen maaş aralığı" : "Toplam bütçe"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display font-semibold text-foreground">Detaylar</h3>
              <div className="space-y-3 text-sm">
                {profile.job && <DetailRow icon={Briefcase} label="Meslek" value={profile.job} />}
                {profile.company && <DetailRow icon={Building} label="Şirket" value={profile.company} />}
                {profile.education && <DetailRow icon={GraduationCap} label="Eğitim" value={profile.education} />}
                {profile.marital_status && <DetailRow icon={Heart} label="Medeni Hal" value={profile.marital_status} />}
                <DetailRow icon={Baby} label="Çocuk" value={profile.has_children ? `${profile.children_count || "Var"}` : "Yok"} />
                <DetailRow icon={Dog} label="Evcil Hayvan" value={profile.has_pet ? profile.pet_type || "Var" : "Yok"} />
                {profile.income && <DetailRow icon={Wallet} label="Gelir" value={profile.income} />}
                {listing.moving_date && <DetailRow icon={Calendar} label="Taşınma" value={listing.moving_date} />}
                {profile.has_references !== null && (
                  <DetailRow icon={User} label="Referans" value={profile.has_references ? "Mevcut" : "Yok"} />
                )}
                {profile.smoking !== null && (
                  <DetailRow icon={Cigarette} label="Sigara" value={profile.smoking ? "Evet" : "Hayır"} />
                )}
              </div>
            </div>

            {user?.id !== listing.user_id && (
              <div className="rounded-2xl bg-gradient-accent p-6 text-center text-accent-foreground">
                <h3 className="mb-2 font-display font-semibold">İletişime Geç</h3>
                <p className="mb-4 text-sm text-accent-foreground/80">
                  {user ? "Bu kişiyle mesajlaşın" : "Bu kişiyle mesajlaşmak için giriş yapın"}
                </p>
                {user ? (
                  <Button variant="hero-outline" className="w-full border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10" onClick={handleMessage}>
                    Mesaj Gönder
                  </Button>
                ) : (
                  <Link to="/giris">
                    <Button variant="hero-outline" className="w-full border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                      Giriş Yap
                    </Button>
                  </Link>
                )}
              </div>
            )}

            <div className="rounded-xl border p-4 text-xs text-muted-foreground">
              <p>Profil oluşturulma: {timeAgo}</p>
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
