import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Wallet, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const categoryLabels: Record<string, string> = {
  "kiralik-ev": "Kiralık Ev",
  "satilik-ev": "Satılık Ev",
  "arac": "Satılık Araç",
  "is-ariyorum": "İş",
};

interface FavoriteItem {
  id: string;
  listing_id: string;
  listing: {
    id: string;
    category: string;
    city: string | null;
    district: string | null;
    budget_min: number | null;
    budget_max: number | null;
    description: string | null;
    user_id: string;
  } | null;
  profile: {
    name: string;
    job: string | null;
    avatar_url: string | null;
  } | null;
}

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/giris");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: favs } = await supabase
        .from("favorites")
        .select("id, listing_id, listing:listings(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (favs && favs.length > 0) {
        const userIds = [...new Set((favs as any[]).filter(f => f.listing).map(f => f.listing.user_id))];
        const { data: profiles } = userIds.length > 0
          ? await supabase.from("profiles").select("user_id, name, job, avatar_url").in("user_id", userIds)
          : { data: [] };
        const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

        setFavorites((favs as any[]).map(f => ({
          id: f.id,
          listing_id: f.listing_id,
          listing: f.listing,
          profile: f.listing ? profileMap.get(f.listing.user_id) || null : null,
        })));
      } else {
        setFavorites([]);
      }
      setLoading(false);
    };
    load();
  }, [user]);

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
    if (!min && !max) return "Belirtilmedi";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    if (min && max) return `${fmt(min)} - ${fmt(max)} ₺`;
    if (min) return `${fmt(min)} ₺+`;
    return `${fmt(max!)} ₺'ye kadar`;
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Favorilerim" description="Favori ilanlarınızı görüntüleyin ve yönetin." path="/favoriler" />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Favorilerim</h1>
          <p className="mt-1 text-muted-foreground">Kaydettiğiniz profiller</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav, i) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-card p-5 shadow-card"
              >
                {fav.listing ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-bold text-accent">
                          {fav.profile?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground text-sm">{fav.profile?.name || "Anonim"}</span>
                          <p className="text-xs text-muted-foreground">{fav.profile?.job || ""}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{categoryLabels[fav.listing.category] || fav.listing.category}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-accent font-medium mb-2">
                      <Wallet className="h-3.5 w-3.5" />
                      {formatBudget(fav.listing.budget_min, fav.listing.budget_max)}
                    </div>

                    {fav.listing.city && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {fav.listing.city}{fav.listing.district ? `, ${fav.listing.district}` : ""}
                      </div>
                    )}

                    {fav.listing.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{fav.listing.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <Link to={`/profil/${fav.listing.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-accent">
                          İncele <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive" onClick={() => removeFavorite(fav.id)}>
                        <Trash2 className="h-3 w-3" /> Kaldır
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Bu ilan artık mevcut değil</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive" onClick={() => removeFavorite(fav.id)}>
                      <Trash2 className="h-3 w-3" /> Kaldır
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
