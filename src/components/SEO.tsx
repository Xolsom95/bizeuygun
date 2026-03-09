import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const SEO = ({
  title = "BizeUygun - Türkiye'nin İlk Ters İlan Platformu",
  description = "Ev, araç veya iş mi arıyorsun? Profilini oluştur, satıcılar seni bulsun. Türkiye'nin ilk ters ilan platformu.",
  path = "",
}: SEOProps) => {
  const siteUrl = "https://bizeuygun.lovable.app";
  const fullTitle = title.includes("BizeUygun") ? title : `${title} | BizeUygun`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}${path}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
