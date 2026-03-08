import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, Home, Car, Building2, Briefcase, ShoppingBag, Wrench, ChevronDown, LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Search className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Bize<span className="text-accent">Uygun</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to}>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
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
          <NotificationBell />
          <Link to="/profil-olustur">
            <Button variant="hero" size="sm">CV Oluştur</Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-accent/10 text-accent text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate text-sm">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/panel" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Panelim
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mesajlar" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Mesajlar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive gap-2">
                  <LogOut className="h-4 w-4" /> Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/giris">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Giriş Yap
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
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
                {user ? (
                  <>
                    <Link to="/panel" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Panelim
                      </Button>
                    </Link>
                    <Link to="/mesajlar" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <MessageSquare className="h-4 w-4" /> Mesajlar
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut className="h-4 w-4" /> Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <Link to="/giris" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full gap-2">
                      <User className="h-4 w-4" /> Giriş Yap
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
