import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import ProfileDetail from "./pages/ProfileDetail";
import CreateProfile from "./pages/CreateProfile";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ara/kiralik-ev" element={<SearchPage category="kiralik-ev" />} />
          <Route path="/ara/satilik-ev" element={<SearchPage category="satilik-ev" />} />
          <Route path="/ara/arac" element={<SearchPage category="arac" />} />
          <Route path="/ara/is-ariyorum" element={<SearchPage category="is-ariyorum" />} />
          <Route path="/ara/ikinci-el" element={<SearchPage category="ikinci-el" />} />
          <Route path="/ara/hizmet" element={<SearchPage category="hizmet" />} />
          <Route path="/profil/:id" element={<ProfileDetail />} />
          <Route path="/profil-olustur" element={<CreateProfile />} />
          <Route path="/nasil-calisir" element={<HowItWorks />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/gizlilik" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
