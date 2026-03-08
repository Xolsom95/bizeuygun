import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Home, Building2, Car, ArrowRight, ArrowLeft, User, MapPin, Briefcase, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const categoryOptions = [
  { value: "kiralik-ev", label: "Kiralık Ev Arıyorum", icon: Home },
  { value: "satilik-ev", label: "Satılık Ev Arıyorum", icon: Building2 },
  { value: "arac", label: "Satılık Araç Arıyorum", icon: Car },
  { value: "is-ariyorum", label: "İş Arıyorum", icon: Briefcase },
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [education, setEducation] = useState("");
  const [income, setIncome] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [hasPet, setHasPet] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [hasReferences, setHasReferences] = useState(false);

  // Step 3 fields
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [movingDate, setMovingDate] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");

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
    if (category === "kiralik-ev") return type === "min" ? "8000" : "15000";
    if (category === "is-ariyorum") return type === "min" ? "25000" : "50000";
    if (category === "ikinci-el") return type === "min" ? "1000" : "10000";
    if (category === "hizmet") return type === "min" ? "2000" : "10000";
    return type === "min" ? "500000" : "1500000";
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Lütfen önce giriş yapın");
      navigate("/giris");
      return;
    }

    setSaving(true);

    // Update profile with personal info
    const { error: profileError } = await supabase.from("profiles").update({
      name: name || undefined,
      age: age ? Number(age) : null,
      job: job || null,
      company: company || null,
      education: education || null,
      income: income || null,
      marital_status: maritalStatus || null,
      children_count: childrenCount ? Number(childrenCount) : null,
      has_pet: hasPet,
      smoking,
      has_references: hasReferences,
      city: city || null,
      district: district || null,
    }).eq("user_id", user.id);

    if (profileError) {
      toast.error("Profil güncellenemedi");
      setSaving(false);
      return;
    }

    // Create listing
    const { error: listingError } = await supabase.from("listings").insert({
      user_id: user.id,
      category,
      city: city || null,
      district: district || null,
      budget_min: budgetMin ? Number(budgetMin) : null,
      budget_max: budgetMax ? Number(budgetMax) : null,
      moving_date: movingDate || null,
      experience: experience || null,
      preferences: selectedFeatures.length > 0 ? selectedFeatures : null,
      description: description || null,
    });

    setSaving(false);

    if (listingError) {
      toast.error("İlan oluşturulamadı");
    } else {
      setStep(4);
      toast.success("İlan başarıyla oluşturuldu!");
    }
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
                  <Input placeholder="Ahmet Yılmaz" className="mt-1" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <Label>Yaş</Label>
                  <Input type="number" placeholder="30" className="mt-1" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <Label>Meslek</Label>
                  <Input placeholder="Yazılım Mühendisi" className="mt-1" value={job} onChange={e => setJob(e.target.value)} />
                </div>
                <div>
                  <Label>Şirket / İşyeri</Label>
                  <Input placeholder="TechCorp" className="mt-1" value={company} onChange={e => setCompany(e.target.value)} />
                </div>
                <div>
                  <Label>Eğitim</Label>
                  <Input placeholder="Bilgisayar Müh., İTÜ" className="mt-1" value={education} onChange={e => setEducation(e.target.value)} />
                </div>
                <div>
                  <Label>Aylık Gelir (Opsiyonel)</Label>
                  <Input placeholder="25.000 ₺+" className="mt-1" value={income} onChange={e => setIncome(e.target.value)} />
                </div>
                <div>
                  <Label>Medeni Hal</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bekar">Bekar</SelectItem>
                      <SelectItem value="evli">Evli</SelectItem>
                      <SelectItem value="bosanmis">Boşanmış</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Çocuk Sayısı</Label>
                  <Input type="number" placeholder="0" className="mt-1" value={childrenCount} onChange={e => setChildrenCount(e.target.value)} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="pet" checked={hasPet} onCheckedChange={v => setHasPet(!!v)} />
                  <Label htmlFor="pet">Evcil hayvanım var</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="smoke" checked={smoking} onCheckedChange={v => setSmoking(!!v)} />
                  <Label htmlFor="smoke">Sigara kullanıyorum</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="reference" checked={hasReferences} onCheckedChange={v => setHasReferences(!!v)} />
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
                  <Input placeholder="İstanbul" className="mt-1" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>İlçe(ler)</Label>
                  <Input placeholder="Kadıköy, Beşiktaş" className="mt-1" value={district} onChange={e => setDistrict(e.target.value)} />
                </div>
                <div>
                  <Label>Minimum {getBudgetLabel()}</Label>
                  <Input type="number" placeholder={getBudgetPlaceholder("min")} className="mt-1" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                </div>
                <div>
                  <Label>Maksimum {getBudgetLabel()}</Label>
                  <Input type="number" placeholder={getBudgetPlaceholder("max")} className="mt-1" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
                </div>
                {(category === "kiralik-ev" || category === "satilik-ev") && (
                  <div>
                    <Label>Taşınma Zamanı</Label>
                    <Select value={movingDate} onValueChange={setMovingDate}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
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
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
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
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Geri
                </Button>
                <Button variant="hero" size="lg" className="gap-2" onClick={handlePublish} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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
                <Link to="/panel">
                  <Button variant="hero" size="lg" className="gap-2">
                    Panelime Git
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => { setStep(1); setCategory(""); setSelectedFeatures([]); }}>
                  Yeni İlan Oluştur
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
