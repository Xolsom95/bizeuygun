import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contactInfo = [
  { icon: Mail, label: "E-posta", value: "destek@bulbeni.com" },
  { icon: Phone, label: "Telefon", value: "+90 (212) 555 00 00" },
  { icon: MapPin, label: "Adres", value: "Levent, İstanbul, Türkiye" },
  { icon: Clock, label: "Çalışma Saatleri", value: "Pzt - Cum, 09:00 - 18:00" },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Mesajınız başarıyla gönderildi!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
          >
            İletişim
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Bize Ulaşın</h2>
              <p className="text-muted-foreground">
                Size en kısa sürede dönüş yapacağız. Ayrıca sosyal medya hesaplarımızdan da bizi takip edebilirsiniz.
              </p>
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-card p-12 text-center shadow-card"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-foreground">Mesajınız Gönderildi!</h3>
                  <p className="text-muted-foreground">En kısa sürede size dönüş yapacağız.</p>
                  <Button variant="hero" className="mt-6" onClick={() => setSubmitted(false)}>
                    Yeni Mesaj Gönder
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-card p-8 shadow-card"
                >
                  <h3 className="mb-6 font-display text-xl font-bold text-foreground">Mesaj Gönder</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Ad Soyad</Label>
                      <Input placeholder="Adınız Soyadınız" className="mt-1" required />
                    </div>
                    <div>
                      <Label>E-posta</Label>
                      <Input type="email" placeholder="ornek@email.com" className="mt-1" required />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Konu</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Konu seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genel">Genel Soru</SelectItem>
                        <SelectItem value="teknik">Teknik Destek</SelectItem>
                        <SelectItem value="oneri">Öneri</SelectItem>
                        <SelectItem value="sikayet">Şikayet</SelectItem>
                        <SelectItem value="isbirligi">İş Birliği</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-4">
                    <Label>Mesajınız</Label>
                    <Textarea className="mt-1" rows={5} placeholder="Mesajınızı yazın..." required />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="mt-6 w-full gap-2">
                    <Send className="h-4 w-4" /> Gönder
                  </Button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
