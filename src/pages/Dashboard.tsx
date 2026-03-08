import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText, Heart, MessageSquare, Settings, Plus, MapPin, Wallet,
  Trash2, Eye, Calendar, ArrowRight, User, Edit,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const categoryLabels: Record<string, string> = {
  "kiralik-ev": "Kiralık Ev",
  "satilik-ev": "Satılık Ev",
  "arac": "Araç",
  "is-ariyorum": "İş",
  "ikinci-el": "İkinci El",
  "hizmet": "Hizmet",
};

interface Listing {
  id: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  city: string | null;
  district: string | null;
  preferences: string[] | null;
  description: string | null;
  is_active: boolean | null;
  created_at: string;
}

interface FavoriteWithListing {
  id: string;
  listing_id: string;
  created_at: string;
  listing: Listing | null;
}

interface Profile {
  name: string;
  job: string | null;
  city: string | null;
  avatar_url: string | null;
  education: string | null;
  bio: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWithListing[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/giris");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoadingData(true);

      const [listingsRes, favoritesRes, profileRes, messagesRes] = await Promise.all([
        supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("favorites").select("*, listing:listings(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("name, job, city, avatar_url, education, bio").eq("user_id", user.id).single(),
        supabase.from("messages").select("id", { count: "exact" }).eq("receiver_id", user.id).eq("is_read", false),
      ]);

      if (listingsRes.data) setListings(listingsRes.data);
      if (favoritesRes.data) {
        setFavorites(favoritesRes.data.map((f: any) => ({
          id: f.id,
          listing_id: f.listing_id,
          created_at: f.created_at,
          listing: f.listing,
        })));
      }
      if (profileRes.data) setProfile(profileRes.data);
      if (messagesRes.count !== null) setUnreadCount(messagesRes.count);

      setLoadingData(false);
    };

    loadData();
  }, [user]);

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast.error("İlan silinemedi");
    } else {
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success("İlan silindi");
    }
  };

  const removeFavorite = async (id: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) {
      toast.error("Favori kaldırılamadı");
    } else {
      setFavorites(prev => prev.filter(f => f.id !== id));
      toast.success("Favoriden kaldırıldı");
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Belirtilmemiş";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    if (min && max) return `${fmt(min)} - ${fmt(max)} ₺`;
    if (min) return `${fmt(min)} ₺+`;
    return `${fmt(max!)} ₺'ye kadar`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  };

  if (authLoading || !user) return null;

  const userInitials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-accent/10 text-accent text-xl font-bold font-display">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {profile?.name || user.email}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.job && `${profile.job} · `}{profile?.city || "Konum belirtilmemiş"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/profil-duzenle">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" /> Profili Düzenle
                </Button>
              </Link>
              <Link to="/profil-olustur">
                <Button variant="hero" className="gap-2">
                  <Plus className="h-4 w-4" /> Yeni İlan
                </Button>
              </Link>
              <Link to="/mesajlar">
                <Button variant="outline" className="gap-2 relative">
                  <MessageSquare className="h-4 w-4" /> Mesajlar
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs h-5 w-5 flex items-center justify-center p-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "İlanlarım", value: listings.length, icon: FileText },
            { label: "Favorilerim", value: favorites.length, icon: Heart },
            { label: "Okunmamış", value: unreadCount, icon: MessageSquare },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-card p-4 shadow-card text-center"
              >
                <Icon className="mx-auto mb-2 h-5 w-5 text-accent" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings" className="gap-2">
              <FileText className="h-4 w-4" /> İlanlarım
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" /> Favorilerim
            </TabsTrigger>
          </TabsList>

          {/* My Listings */}
          <TabsContent value="listings">
            {loadingData ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Henüz ilanınız yok</h3>
                <p className="mb-4 text-sm text-muted-foreground">İlk CV'nizi oluşturun ve satıcıların sizi bulmasını sağlayın</p>
                <Link to="/profil-olustur">
                  <Button variant="hero" className="gap-2">
                    <Plus className="h-4 w-4" /> CV Oluştur
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-card p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {categoryLabels[listing.category] || listing.category}
                        </Badge>
                        <p className="font-medium text-accent">
                          {formatBudget(listing.budget_min, listing.budget_max)}
                        </p>
                      </div>
                      <Badge className={listing.is_active ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                        {listing.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>

                    {listing.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.city}{listing.district ? `, ${listing.district}` : ""}
                      </div>
                    )}

                    {listing.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>
                    )}

                    {listing.preferences && listing.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {listing.preferences.slice(0, 3).map(p => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                        {listing.preferences.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{listing.preferences.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(listing.created_at)}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive" onClick={() => deleteListing(listing.id)}>
                          <Trash2 className="h-3 w-3" /> Sil
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites">
            {loadingData ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card">
                <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Henüz favoriniz yok</h3>
                <p className="mb-4 text-sm text-muted-foreground">Profilleri inceleyin ve beğendiklerinizi kaydedin</p>
                <Link to="/ara/kiralik-ev">
                  <Button variant="outline" className="gap-2">
                    Profilleri İncele <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {favorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-card p-5 shadow-card"
                  >
                    {fav.listing ? (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline">
                            {categoryLabels[fav.listing.category] || fav.listing.category}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive" onClick={() => removeFavorite(fav.id)}>
                            <Trash2 className="h-3 w-3" /> Kaldır
                          </Button>
                        </div>
                        <p className="font-medium text-accent mb-2">
                          {formatBudget(fav.listing.budget_min, fav.listing.budget_max)}
                        </p>
                        {fav.listing.city && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3.5 w-3.5" />
                            {fav.listing.city}{fav.listing.district ? `, ${fav.listing.district}` : ""}
                          </div>
                        )}
                        {fav.listing.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{fav.listing.description}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Bu ilan artık mevcut değil</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
