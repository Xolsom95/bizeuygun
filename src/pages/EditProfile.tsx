import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  name: string;
  age: number | null;
  job: string | null;
  company: string | null;
  education: string | null;
  income: string | null;
  marital_status: string | null;
  children_count: number | null;
  has_pet: boolean | null;
  pet_type: string | null;
  smoking: boolean | null;
  has_references: boolean | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const EditProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState<ProfileData>({
    name: "", age: null, job: null, company: null, education: null,
    income: null, marital_status: null, children_count: null,
    has_pet: false, pet_type: null, smoking: false, has_references: false,
    city: null, district: null, phone: null, bio: null, avatar_url: null,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/giris");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, contactRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("name, age, job, company, education, income, marital_status, children_count, has_pet, pet_type, smoking, has_references, city, district, bio, avatar_url")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("contacts")
          .select("phone")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (profileRes.data) {
        setForm({ ...profileRes.data, phone: contactRes.data?.phone ?? null });
      }
      setLoadingProfile(false);
    };
    load();
  }, [user]);

  const updateField = (key: keyof ProfileData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Dosya boyutu 2MB'dan küçük olmalı");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Fotoğraf yüklenemedi");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    updateField("avatar_url", avatarUrl);
    setUploading(false);
    toast.success("Fotoğraf yüklendi");
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.name.trim()) {
      toast.error("Ad Soyad zorunludur");
      return;
    }

    setSaving(true);
    const [{ error }, { error: contactError }] = await Promise.all([
      supabase
        .from("profiles")
        .update({
          name: form.name,
          age: form.age,
          job: form.job,
          company: form.company,
          education: form.education,
          income: form.income,
          marital_status: form.marital_status,
          children_count: form.children_count,
          has_pet: form.has_pet,
          pet_type: form.pet_type,
          smoking: form.smoking,
          has_references: form.has_references,
          city: form.city,
          district: form.district,
          bio: form.bio,
          avatar_url: form.avatar_url,
        })
        .eq("user_id", user.id),
      supabase
        .from("contacts")
        .upsert({ user_id: user.id, phone: form.phone }, { onConflict: "user_id" }),
    ]);

    setSaving(false);
    if (error || contactError) {
      toast.error("Profil güncellenemedi");
    } else {
      toast.success("Profil güncellendi!");
      navigate("/panel");
    }
  };

  if (authLoading || !user || loadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  const initials = form.name
    ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Profilimi Düzenle" description="Profil bilgilerinizi güncelleyin." path="/profil-duzenle" />
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card p-8 shadow-card"
        >
          <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Profilimi Düzenle</h1>

          {/* Avatar */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {form.avatar_url ? (
                  <AvatarImage src={form.avatar_url} alt={form.name} />
                ) : null}
                <AvatarFallback className="bg-accent/10 text-accent text-2xl font-bold font-display">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <p className="text-xs text-muted-foreground">Maks. 2MB, JPG/PNG</p>
          </div>

          {/* Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Ad Soyad *</Label>
              <Input value={form.name} onChange={e => updateField("name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Yaş</Label>
              <Input type="number" value={form.age ?? ""} onChange={e => updateField("age", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
            </div>
            <div>
              <Label>Meslek</Label>
              <Input value={form.job ?? ""} onChange={e => updateField("job", e.target.value || null)} className="mt-1" />
            </div>
            <div>
              <Label>Şirket</Label>
              <Input value={form.company ?? ""} onChange={e => updateField("company", e.target.value || null)} className="mt-1" />
            </div>
            <div>
              <Label>Eğitim</Label>
              <Input value={form.education ?? ""} onChange={e => updateField("education", e.target.value || null)} className="mt-1" />
            </div>
            <div>
              <Label>Aylık Gelir</Label>
              <Input value={form.income ?? ""} onChange={e => updateField("income", e.target.value || null)} className="mt-1" />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input value={form.phone ?? ""} onChange={e => updateField("phone", e.target.value || null)} className="mt-1" placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <Label>Medeni Hal</Label>
              <Select value={form.marital_status ?? ""} onValueChange={v => updateField("marital_status", v || null)}>
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
              <Input type="number" value={form.children_count ?? ""} onChange={e => updateField("children_count", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
            </div>
            <div>
              <Label>Şehir</Label>
              <Input value={form.city ?? ""} onChange={e => updateField("city", e.target.value || null)} className="mt-1" />
            </div>
            <div>
              <Label>İlçe</Label>
              <Input value={form.district ?? ""} onChange={e => updateField("district", e.target.value || null)} className="mt-1" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="pet" checked={form.has_pet ?? false} onCheckedChange={v => updateField("has_pet", !!v)} />
              <Label htmlFor="pet">Evcil hayvanım var</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="smoke" checked={form.smoking ?? false} onCheckedChange={v => updateField("smoking", !!v)} />
              <Label htmlFor="smoke">Sigara kullanıyorum</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ref" checked={form.has_references ?? false} onCheckedChange={v => updateField("has_references", !!v)} />
              <Label htmlFor="ref">Referanslarım mevcut</Label>
            </div>
          </div>

          <div className="mt-4">
            <Label>Hakkımda</Label>
            <Textarea value={form.bio ?? ""} onChange={e => updateField("bio", e.target.value || null)} className="mt-1" rows={3} placeholder="Kendinizi kısaca tanıtın..." />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => navigate("/panel")}>İptal</Button>
            <Button variant="hero" onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Kaydet
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
