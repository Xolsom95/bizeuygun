import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Kullanım Koşulları"
        description="BizeUygun platformunun kullanım koşulları ve kullanıcı sözleşmesi."
        path="/kullanim-kosullari"
      />
      <Navbar />
      <article className="prose prose-slate max-w-3xl mx-auto py-12 px-4 dark:prose-invert">
        <h1>Kullanım Koşulları</h1>
        <p>Bu sayfanın içeriği yakında güncellenecektir.</p>
      </article>
      <Footer />
    </div>
  );
};

export default TermsOfService;
