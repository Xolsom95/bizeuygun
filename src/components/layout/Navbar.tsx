import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, Home, Car, Building2, Briefcase, ShoppingBag, Wrench, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { to: "/ara/kiralik-ev", label: "Kiralık Ev", icon: Home },
  { to: "/ara/satilik-ev", label: "Satılık Ev", icon: Building2 },
  { to: "/ara/arac", label: "Araç", icon: Car },
];

const moreLinks = [
  { to: "/ara/is-ariyorum", label: "İş Arayanlar", icon: Briefcase },
  { to: "/ara/ikinci-el", label: "İkinci El", icon: ShoppingBag },
  { to: "/ara/hizmet", label: "Hizmet", icon: Wrench },
];

const allLinks = [...navLinks, ...moreLinks];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Search className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Bul<span className="text-accent">Beni</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Daha Fazla <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link to="/profil-olustur">
            <Button variant="hero" size="sm">
              CV Oluştur
            </Button>
          </Link>
          <Link to="/giris">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Giriş Yap
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-card md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="mt-2 flex flex-col gap-2 border-t pt-2">
                <Link to="/profil-olustur" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="w-full">CV Oluştur</Button>
                </Link>
                <Link to="/giris" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
