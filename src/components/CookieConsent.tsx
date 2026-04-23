import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

type ConsentValue = "all" | "essential" | "custom";
const STORAGE_KEY = "cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/90 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 shrink-0 text-accent mt-0.5" />
          <p className="text-sm text-foreground">
            Bu sitede deneyiminizi iyileştirmek için çerezler kullanıyoruz.
            Detaylar için{" "}
            <Link to="/cerez-politikasi" className="font-medium text-accent underline underline-offset-2">
              Çerez Politikası
            </Link>
            'nı inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => choose("custom")}>
            Ayarlar
          </Button>
          <Button size="sm" variant="outline" onClick={() => choose("essential")}>
            Sadece Zorunlu
          </Button>
          <Button size="sm" variant="hero" onClick={() => choose("all")}>
            Tümünü Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
