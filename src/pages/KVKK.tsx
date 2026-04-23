import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const KVKK = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="KVKK Aydınlatma Metni"
        description="BizeUygun KVKK kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni."
        path="/kvkk"
      />
      <Navbar />
      <article className="prose prose-slate max-w-3xl mx-auto py-12 px-4 dark:prose-invert">
        <h1>KVKK Aydınlatma Metni</h1>
        <p>Bu sayfanın içeriği yakında güncellenecektir.</p>
      </article>
      <Footer />
    </div>
  );
};

export default KVKK;
