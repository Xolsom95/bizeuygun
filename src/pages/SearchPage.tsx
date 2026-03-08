import { useState } from "react";
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
  Filter,
  ArrowRight,
  Briefcase,
  Home,
  Baby,
  Dog,
  Building2,
  Car,
  Search,
  Wrench,
  ShoppingBag,
  SortAsc,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProfiles, type Profile } from "@/data/mockProfiles";

const categoryConfig: Record<string, { label: string; icon: typeof Home; description: string }> = {
  "kiralik-ev": { label: "Kiralık Ev Arayanlar", icon: Home, description: "Kiracı profilleri ve bütçeleri" },
  "satilik-ev": { label: "Satılık Ev Arayanlar", icon: Building2, description: "Alıcı profilleri ve bütçeleri" },
  "arac": { label: "Araç Arayanlar", icon: Car, description: "Araç alıcı profilleri" },
  "is-ariyorum": { label: "İş Arayanlar", icon: Briefcase, description: "İş arayan profesyoneller" },
  "ikinci-el": { label: "İkinci El Arayanlar", icon: ShoppingBag, description: "İkinci el eşya arayanlar" },
  "hizmet": { label: "Hizmet Arayanlar", icon: Wrench, description: "Hizmet talepleri" },
};

interface SearchPageProps {
  category?: string;
}

const SearchPage = ({ category = "kiralik-ev" }: SearchPageProps) => {
  const [searchCity, setSearchCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const config = categoryConfig[selectedCategory] || categoryConfig["kiralik-ev"];
  const CategoryIcon = config.icon;

  let filteredProfiles = mockProfiles.filter((p) => {
    const matchesCategory = p.category === selectedCategory;
    const matchesCity = !searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchesName = !searchName || p.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesVerified = !verifiedOnly || p.verified;
    return matchesCategory && matchesCity && matchesName && matchesVerified;
  });

  // Sort
  if (sortBy === "budget-asc") {
    filteredProfiles = [...filteredProfiles].sort((a, b) => a.budget.localeCompare(b.budget));
  } else if (sortBy === "budget-desc") {
    filteredProfiles = [...filteredProfiles].sort((a, b) => b.budget.localeCompare(a.budget));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon className="h-8 w-8 text-accent" />
            <h1 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              {config.label}
            </h1>
          </div>
          <p className="mb-4 text-sm text-primary-foreground/60">{config.description}</p>

          {/* Filters */}
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

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProfiles.length}</span> profil bulundu
          </p>

          {filteredProfiles.length === 0 ? (
            <div className="rounded-2xl bg-card p-12 text-center shadow-card">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Profil Bulunamadı</h3>
              <p className="text-sm text-muted-foreground">Filtrelerinizi değiştirmeyi deneyin</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfiles.map((profile, i) => (
                <ProfileCard key={profile.id} profile={profile} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ProfileCard = ({ profile, index }: { profile: Profile; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link to={`/profil/${profile.id}`}>
      <div className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-display font-bold text-accent">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{profile.name}</span>
                {profile.verified && (
                  <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">
                    ✓
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{profile.age} yaş</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{profile.createdAt}</span>
        </div>

        {/* Info grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{profile.job}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{profile.city}, {profile.district}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate font-medium text-accent">{profile.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-3.5 w-3.5 shrink-0" />
            <span>{profile.maritalStatus}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-3 flex gap-2">
          {profile.hasChildren && (
            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              <Baby className="h-3 w-3" /> Çocuklu
            </div>
          )}
          {profile.hasPet && (
            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              <Dog className="h-3 w-3" /> {profile.petType || "Evcil Hayvan"}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {profile.preferences.slice(0, 4).map((pref) => (
            <Badge key={pref} variant="outline" className="text-xs">
              {pref}
            </Badge>
          ))}
          {profile.preferences.length > 4 && (
            <Badge variant="outline" className="text-xs">+{profile.preferences.length - 4}</Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{profile.description}</p>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-end gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
          Profili İncele <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default SearchPage;
