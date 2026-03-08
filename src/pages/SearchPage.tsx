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
  User,
  Heart,
  Filter,
  ArrowRight,
  Briefcase,
  Home,
  Baby,
  Dog,
  Building2,
  Car,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data
const mockProfiles = [
  {
    id: "1",
    name: "Ahmet Y.",
    age: 32,
    job: "Yazılım Mühendisi",
    company: "TechCorp",
    city: "İstanbul",
    district: "Kadıköy",
    budget: "12.000 - 18.000 ₺",
    category: "kiralik-ev",
    maritalStatus: "Evli",
    hasChildren: true,
    hasPet: false,
    preferences: ["3+1", "Asansörlü", "Otoparklı", "Balkonlu"],
    description: "2 çocuklu bir aileyiz. Güvenli ve sakin bir mahallede, okula yakın bir daire arıyoruz.",
    avatar: "AY",
    createdAt: "2 gün önce",
    verified: true,
  },
  {
    id: "2",
    name: "Elif K.",
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
    preferences: ["2+1", "Evcil hayvan dostu", "Metro yakını"],
    description: "Freelance çalışan, sakin bir kiracıyım. Kedim var, temiz ve düzenli yaşarım.",
    avatar: "EK",
    createdAt: "5 saat önce",
    verified: true,
  },
  {
    id: "3",
    name: "Murat D.",
    age: 45,
    job: "İnşaat Mühendisi",
    company: "Yapı A.Ş.",
    city: "Ankara",
    district: "Çankaya",
    budget: "1.500.000 - 2.500.000 ₺",
    category: "satilik-ev",
    maritalStatus: "Evli",
    hasChildren: true,
    hasPet: false,
    preferences: ["4+1", "Müstakil", "Bahçeli", "Garajlı"],
    description: "Emekliliğe yakın, ailece yaşayacağımız geniş ve bahçeli bir ev arıyoruz.",
    avatar: "MD",
    createdAt: "1 gün önce",
    verified: false,
  },
  {
    id: "4",
    name: "Zeynep A.",
    age: 26,
    job: "Pazarlama Uzmanı",
    company: "MediaGroup",
    city: "İzmir",
    district: "Bornova",
    budget: "400.000 - 700.000 ₺",
    category: "arac",
    maritalStatus: "Bekar",
    hasChildren: false,
    hasPet: false,
    preferences: ["SUV", "Otomatik", "2020+", "Benzin/Hibrit"],
    description: "İşe gidip gelmek için güvenilir, düşük yakıtlı bir SUV arıyorum.",
    avatar: "ZA",
    createdAt: "3 saat önce",
    verified: true,
  },
  {
    id: "5",
    name: "Burak S.",
    age: 35,
    job: "Avukat",
    company: "Serbest",
    city: "İstanbul",
    district: "Üsküdar",
    budget: "15.000 - 22.000 ₺",
    category: "kiralik-ev",
    maritalStatus: "Evli",
    hasChildren: true,
    hasPet: false,
    preferences: ["3+1", "Deniz manzaralı", "Kapalı otopark", "Site içi"],
    description: "3 kişilik ailemizle güvenli bir sitede yaşamak istiyoruz. Referanslarım mevcuttur.",
    avatar: "BS",
    createdAt: "1 saat önce",
    verified: true,
  },
  {
    id: "6",
    name: "Selin T.",
    age: 30,
    job: "Doktor",
    company: "Devlet Hastanesi",
    city: "Bursa",
    district: "Nilüfer",
    budget: "2.000.000 - 3.500.000 ₺",
    category: "satilik-ev",
    maritalStatus: "Evli",
    hasChildren: false,
    hasPet: true,
    preferences: ["3+1", "Yeni bina", "Akıllı ev", "Otoparklı"],
    description: "Yeni evlendik, modern ve konforlu bir daire arıyoruz. Köpeğimiz var.",
    avatar: "ST",
    createdAt: "6 saat önce",
    verified: true,
  },
];

const categoryConfig: Record<string, { label: string; icon: typeof Home }> = {
  "kiralik-ev": { label: "Kiralık Ev Arayanlar", icon: Home },
  "satilik-ev": { label: "Satılık Ev Arayanlar", icon: Building2 },
  "arac": { label: "Araç Arayanlar", icon: Car },
};

interface SearchPageProps {
  category?: string;
}

const SearchPage = ({ category = "kiralik-ev" }: SearchPageProps) => {
  const [searchCity, setSearchCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category);

  const config = categoryConfig[selectedCategory] || categoryConfig["kiralik-ev"];
  const CategoryIcon = config.icon;

  const filteredProfiles = mockProfiles.filter((p) => {
    const matchesCategory = p.category === selectedCategory;
    const matchesCity = !searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <CategoryIcon className="h-8 w-8 text-accent" />
            <h1 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              {config.label}
            </h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kiralik-ev">Kiralık Ev</SelectItem>
                <SelectItem value="satilik-ev">Satılık Ev</SelectItem>
                <SelectItem value="arac">Araç</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Şehir ara..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-48 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />

            <Button variant="hero" size="default" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrele
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                                ✓ Doğrulanmış
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
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="truncate">{profile.job}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{profile.city}, {profile.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="truncate font-medium text-accent">{profile.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{profile.maritalStatus}</span>
                      </div>
                    </div>

                    {/* Icons row */}
                    <div className="mb-3 flex gap-2">
                      {profile.hasChildren && (
                        <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                          <Baby className="h-3 w-3" /> Çocuklu
                        </div>
                      )}
                      {profile.hasPet && (
                        <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                          <Dog className="h-3 w-3" /> Evcil Hayvan
                        </div>
                      )}
                    </div>

                    {/* Preferences */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {profile.preferences.map((pref) => (
                        <Badge key={pref} variant="outline" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
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
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchPage;
