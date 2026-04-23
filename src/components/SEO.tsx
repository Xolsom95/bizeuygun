import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  preloadImage?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "BizeUygun - Türkiye'nin İlk Ters İlan Platformu",
  description = "Ev, araç veya iş mi arıyorsun? Profilini oluştur, satıcılar seni bulsun. Türkiye'nin ilk ters ilan platformu.",
  path = "",
  preloadImage,
  noindex = false,
}: SEOProps) => {
  const siteUrl = "https://www.bizeuygun.com";
  const fullTitle = title.includes("BizeUygun") ? title : `${title} | BizeUygun`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={`${siteUrl}${path}`} />
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} type="image/webp" {...({ fetchpriority: "high" } as any)} />
      )}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="BizeUygun" />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
