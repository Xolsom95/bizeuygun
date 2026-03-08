import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="BizeUygun" className="h-9 w-9 rounded-lg" />
              <span className="font-display text-xl font-bold">
                Bize<span className="text-accent">Uygun</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Artık ilanı alıcı verir, satıcı bulur. Yeni nesil ters ilan platformu.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Kategoriler</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/ara/kiralik-ev" className="hover:text-accent transition-colors">Kiralık Ev</Link></li>
              <li><Link to="/ara/satilik-ev" className="hover:text-accent transition-colors">Satılık Ev</Link></li>
              <li><Link to="/ara/arac" className="hover:text-accent transition-colors">Araç</Link></li>
              <li><Link to="/ara/is-ariyorum" className="hover:text-accent transition-colors">İş Arayanlar</Link></li>
              <li><Link to="/ara/ikinci-el" className="hover:text-accent transition-colors">İkinci El</Link></li>
              <li><Link to="/ara/hizmet" className="hover:text-accent transition-colors">Hizmet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/nasil-calisir" className="hover:text-accent transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link to="/profil-olustur" className="hover:text-accent transition-colors">CV Oluştur</Link></li>
              <li><Link to="/hakkimizda" className="hover:text-accent transition-colors">Hakkımızda</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Destek</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/iletisim" className="hover:text-accent transition-colors">İletişim</Link></li>
              <li><Link to="/gizlilik" className="hover:text-accent transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/giris" className="hover:text-accent transition-colors">Giriş Yap</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} BizeUygun. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
