import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Building2, Car, ArrowRight, ArrowLeft, User, MapPin, Briefcase, ShoppingBag, Wrench, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categoryOptions = [
  { value: "kiralik-ev", label: "Kiralık Ev Arıyorum", icon: Home },
  { value: "satilik-ev", label: "Satılık Ev Arıyorum", icon: Building2 },
  { value: "arac", label: "Araç Arıyorum", icon: Car },
  { value: "is-ariyorum", label: "İş Arıyorum", icon: Briefcase },
  { value: "ikinci-el", label: "İkinci El Eşya Arıyorum", icon: ShoppingBag },
  { value: "hizmet", label: "Hizmet Arıyorum", icon: Wrench },
];

const featuresByCategory: Record<string, string[]> = {
  "kiralik-ev": ["1+1", "2+1", "3+1", "4+1", "5+1", "Asansörlü", "Otoparklı", "Balkonlu", "Doğalgaz", "Site içi", "Evcil hayvan dostu", "Eşyalı", "Metro yakını", "Deniz manzaralı", "Güvenlikli"],
  "satilik-ev": ["1+1", "2+1", "3+1", "4+1", "5+1", "Villa", "Müstakil", "Bahçeli", "Garajlı", "Akıllı ev", "Yeni bina", "Havuzlu", "Teras", "Manzaralı"],
  "arac": ["Sedan", "SUV", "Hatchback", "Station Wagon", "Otomatik", "Manuel", "Benzin", "Dizel", "Hibrit", "Elektrik", "2020+", "2022+", "2024+", "0 km", "Düşük km"],
  "is-ariyorum": ["Remote", "Hibrit", "Ofis", "Tam zamanlı", "Part-time", "Freelance", "Stajyer", "Yazılım", "Pazarlama", "Finans", "Sağlık", "Eğitim", "Mühendislik", "SGK'lı"],
  "ikinci-el": ["Mobilya", "Beyaz eşya", "Elektronik", "Laptop", "Telefon", "Ev dekorasyonu", "Spor ekipmanı", "Müzik aleti", "Az kullanılmış", "Taşıma dahil", "Fatura/garanti"],
  "hizmet": ["Temizlik", "Tadilat", "Boyama", "Tesisatçı", "Elektrikçi", "Nakliyat", "İç dekorasyon", "Bahçe bakımı", "Profesyonel", "Referanslı", "Portföylü", "Hafta sonu müsait"],
};

const CreateProfile = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const getFeatures = () => featuresByCategory[category] || [];

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const getBudgetLabel = () => {
    if (category === "kiralik-ev") return "Aylık Kira Bütçesi";
    if (category === "is-ariyorum") return "Beklenen Maaş Aralığı";
    if (category === "hizmet") return "Hizmet Bütçesi";
    return "Toplam Bütçe";
  };

  const getBudgetPlaceholder = (type: "min" | "max") => {
    if (category === "kiralik-ev") return type === "min" ? "8.000 ₺" : "15.000 ₺";
    if (category === "is-ariyorum") return type === "min" ? "25.000 ₺" : "50.000 ₺";
    if (category === "ikinci-el") return type === "min" ? "1.000 ₺" : "10.000 ₺";
    if (category === "hizmet") return type === "min" ? "2.000 ₺" : "10.000 ₺";
    return type === "min" ? "500.000 ₺" : "1.500.000 ₺";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  s <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 4 && <div className={`h-0.5 w-8 rounded ${s < step ? "bg-accent" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-card p-8 shadow-card"
        >
          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Ne Arıyorsun?</h1>
              <p className="mb-6 text-muted-foreground">Kategori seç ve profilini oluşturmaya başla</p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setCategory(opt.value); setSelectedFeatures([]); }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                        isSelected
                          ? "border-accent bg-accent/5 shadow-accent-glow"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium text-center ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button variant="hero" size="lg" className="gap-2" onClick={() => category && setStep(2)} disabled={!category}>
                  Devam Et <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
                <User className="inline h-6 w-6 mr-2 text-accent" />
                Kişisel Bilgiler
              </h1>
              <p className="mb-6 text-muted-foreground">Satıcı/ev sahibinin seni tanıması için</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Ad Soyad</Label>
                  <Input placeholder="Ahmet Yılmaz" className="mt-1" />
                </div>
                <div>
                  <Label>Yaş</Label>
                  <Input type="number" placeholder="30" className="mt-1" />
                </div>
                <div>
                  <Label>Meslek</Label>
                  <Input placeholder="Yazılım Mühendisi" className="mt-1" />
                </div>
                <div>
                  <Label>Şirket / İşyeri</Label>
                  <Input placeholder="TechCorp" className="mt-1" />
                </div>
                <div>
                  <Label>Eğitim</Label>
                  <Input placeholder="Bilgisayar Müh., İTÜ" className="mt-1" />
                </div>
                <div>
                  <Label>Aylık Gelir (Opsiyonel)</Label>
                  <Input placeholder="25.000 ₺+" className="mt-1" />
                </div>
                <div>
                  <Label>Medeni Hal</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bekar">Bekar</SelectItem>
                      <SelectItem value="evli">Evli</SelectItem>
                      <SelectItem value="bosanmis">Boşanmış</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Çocuk Sayısı</Label>
                  <Input type="number" placeholder="0" className="mt-1" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="pet" />
                  <Label htmlFor="pet">Evcil hayvanım var</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="smoke" />
                  <Label htmlFor="smoke">Sigara kullanıyorum</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="reference" />
                  <Label htmlFor="reference">Referanslarım mevcut</Label>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Geri
                </Button>
                <Button variant="hero" size="lg" className="gap-2" onClick={() => setStep(3)}>
                  Devam Et <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
                <MapPin className="inline h-6 w-6 mr-2 text-accent" />
                Konum ve Tercihler
              </h1>
              <p className="mb-6 text-muted-foreground">Detaylı kriterlerini belirle</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Şehir</Label>
                  <Input placeholder="İstanbul" className="mt-1" />
                </div>
                <div>
                  <Label>İlçe(ler)</Label>
                  <Input placeholder="Kadıköy, Beşiktaş" className="mt-1" />
                </div>
                <div>
                  <Label>Minimum {getBudgetLabel()}</Label>
                  <Input placeholder={getBudgetPlaceholder("min")} className="mt-1" />
                </div>
                <div>
                  <Label>Maksimum {getBudgetLabel()}</Label>
                  <Input placeholder={getBudgetPlaceholder("max")} className="mt-1" />
                </div>
                {(category === "kiralik-ev" || category === "satilik-ev") && (
                  <div>
                    <Label>Taşınma Zamanı</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hemen">Hemen</SelectItem>
                        <SelectItem value="1ay">1 ay içinde</SelectItem>
                        <SelectItem value="3ay">3 ay içinde</SelectItem>
                        <SelectItem value="esnek">Esnek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {category === "is-ariyorum" && (
                  <div>
                    <Label>Deneyim Süresi</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 yıl</SelectItem>
                        <SelectItem value="1-3">1-3 yıl</SelectItem>
                        <SelectItem value="3-5">3-5 yıl</SelectItem>
                        <SelectItem value="5-10">5-10 yıl</SelectItem>
                        <SelectItem value="10+">10+ yıl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Label className="mb-3 block">Aranan Özellikler</Label>
                <div className="flex flex-wrap gap-2">
                  {getFeatures().map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                        selectedFeatures.includes(f)
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label>Ek Açıklama</Label>
                <Textarea
                  className="mt-1"
                  rows={4}
                  placeholder="Kendinizi ve aradığınız şey hakkında detaylı bilgi verin..."
                />
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Geri
                </Button>
                <Button variant="hero" size="lg" className="gap-2" onClick={() => setStep(4)}>
                  Önizle ve Yayınla <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <CheckCircle className="h-12 w-12 text-success" />
              </motion.div>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
                Profilin Hazır! 🎉
              </h1>
              <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                CV'n başarıyla oluşturuldu. Artık satıcılar ve ev sahipleri seni bulabilir.
                Teklif geldiğinde bildirim alacaksın.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/profil/1">
                  <Button variant="hero" size="lg" className="gap-2">
                    Profilimi Gör
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => { setStep(1); setCategory(""); setSelectedFeatures([]); }}>
                  Yeni Profil Oluştur
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateProfile;
