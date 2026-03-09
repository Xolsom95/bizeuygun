import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Wallet,
  Heart,
  ArrowRight,
  Briefcase,
  Home,
  Baby,
  Dog,
  Building2,
  Car,
  Search,
  SortAsc,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const categoryConfig: Record<string, { label: string; icon: typeof Home; description: string }> = {
  "kiralik-ev": { label: "Kiralık Ev Arayanlar", icon: Home, description: "Kiracı profilleri ve bütçeleri" },
  "satilik-ev": { label: "Satılık Ev Arayanlar", icon: Building2, description: "Alıcı profilleri ve bütçeleri" },
  "arac": { label: "Satılık Araç Arayanlar", icon: Car, description: "Araç alıcı profilleri" },
  "is-ariyorum": { label: "İş Arayanlar", icon: Briefcase, description: "İş arayan profesyoneller" },
};

interface ListingWithProfile {
  id: string;
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
  profile: {
    name: string;
    age: number | null;
    job: string | null;
    marital_status: string | null;
    has_children: boolean | null;
    children_count: number | null;
    has_pet: boolean | null;
    pet_type: string | null;
    avatar_url: string | null;
  } | null;
}

interface SearchPageProps {
  category?: string;
}

const SearchPage = ({ category = "kiralik-ev" }: SearchPageProps) => {
  const [searchCity, setSearchCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [listings, setListings] = useState<ListingWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const config = categoryConfig[selectedCategory] || categoryConfig["kiralik-ev"];
  const CategoryIcon = config.icon;

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select("*")
        .eq("category", selectedCategory)
        .eq("is_active", true);

      if (searchCity) {
        query = query.ilike("city", `%${searchCity}%`);
      }
      if (verifiedOnly) {
        query = query.eq("verified", true);
      }
      if (sortBy === "budget-asc") {
        query = query.order("budget_min", { ascending: true, nullsFirst: false });
      } else if (sortBy === "budget-desc") {
        query = query.order("budget_max", { ascending: false, nullsFirst: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data: listingsData, error } = await query;

      if (!error && listingsData) {
        // Fetch profiles for all listing user_ids
        const userIds = [...new Set(listingsData.map((l) => l.user_id))];
        const { data: profilesData } = userIds.length > 0
          ? await supabase.from("profiles").select("user_id, name, age, job, marital_status, has_children, children_count, has_pet, pet_type, avatar_url").in("user_id", userIds)
          : { data: [] };

        const profileMap = new Map((profilesData || []).map((p) => [p.user_id, p]));

        let results: ListingWithProfile[] = listingsData.map((l) => ({
          ...l,
          profile: profileMap.get(l.user_id) || null,
        }));

        if (searchName) {
          results = results.filter(
            (l) => l.profile?.name?.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        setListings(results);
      } else {
        setListings([]);
      }
      setLoading(false);
    };

    fetchListings();
  }, [selectedCategory, searchCity, searchName, sortBy, verifiedOnly]);


  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Belirtilmedi";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    if (min && max) return `${fmt(min)} - ${fmt(max)} ₺`;
    if (min) return `${fmt(min)} ₺+`;
    return `${fmt(max!)} ₺'ye kadar`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={config.label} description={`${config.label} - ${config.description}`} path={`/ara/${selectedCategory}`} />
      <Navbar />

      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon className="h-8 w-8 text-accent" />
            <h1 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              {config.label}
            </h1>
          </div>
          <p className="mb-4 text-sm text-primary-foreground/60">{config.description}</p>

          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label.replace(" Arayanlar", "").replace(" Arıyorum", "")}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Şehir ara..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-40 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Input
              placeholder="İsim ara..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-40 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SortAsc className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">En Yeni</SelectItem>
                <SelectItem value="budget-asc">Bütçe (Artan)</SelectItem>
                <SelectItem value="budget-desc">Bütçe (Azalan)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={verifiedOnly ? "hero" : "ghost"}
              size="default"
              className={`gap-2 ${!verifiedOnly ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" : ""}`}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
            >
              ✓ Doğrulanmış
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{listings.length}</span> profil bulundu
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-2xl bg-card p-12 text-center shadow-card">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Profil Bulunamadı</h3>
              <p className="text-sm text-muted-foreground">Filtrelerinizi değiştirmeyi deneyin</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ListingCard = ({ listing, index }: { listing: ListingWithProfile; index: number }) => {
  const profile = listing.profile;
  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Belirtilmedi";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    if (min && max) return `${fmt(min)} - ${fmt(max)} ₺`;
    if (min) return `${fmt(min)} ₺+`;
    return `${fmt(max!)} ₺'ye kadar`;
  };

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/profil/${listing.id}`}>
        <div className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-display font-bold text-accent">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{profile?.name || "Anonim"}</span>
                  {listing.verified && (
                    <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">✓</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{profile?.age ? `${profile.age} yaş` : ""}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            {profile?.job && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{profile.job}</span>
              </div>
            )}
            {listing.city && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{listing.city}{listing.district ? `, ${listing.district}` : ""}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium text-accent">{formatBudget(listing.budget_min, listing.budget_max)}</span>
            </div>
            {profile?.marital_status && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-3.5 w-3.5 shrink-0" />
                <span>{profile.marital_status}</span>
              </div>
            )}
          </div>

          <div className="mb-3 flex gap-2">
            {profile?.has_children && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                <Baby className="h-3 w-3" /> Çocuklu
              </div>
            )}
            {profile?.has_pet && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                <Dog className="h-3 w-3" /> {profile.pet_type || "Evcil Hayvan"}
              </div>
            )}
          </div>

          {listing.preferences && listing.preferences.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {listing.preferences.slice(0, 4).map((pref) => (
                <Badge key={pref} variant="outline" className="text-xs">{pref}</Badge>
              ))}
              {listing.preferences.length > 4 && (
                <Badge variant="outline" className="text-xs">+{listing.preferences.length - 4}</Badge>
              )}
            </div>
          )}

          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
          )}

          <div className="mt-4 flex items-center justify-end gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Profili İncele <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SearchPage;
