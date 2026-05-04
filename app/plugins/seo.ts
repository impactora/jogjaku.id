export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const route = useRoute();
  const siteUrl = String(config.public.siteUrl || "https://jogjaku.id").replace(
    /\/$/,
    "",
  );

  const canonical = computed(() => {
    const path = route.path === "" ? "/" : route.path;
    return `${siteUrl}${path === "/" ? "" : path}`;
  });

  const defaultOgImage = `${siteUrl}/images/home/Tugu_Jogja-hero.jpg`;

  useSeoMeta({
    ogUrl: canonical,
    ogType: "website",
    ogSiteName: "JogjaKu",
    ogLocale: "id_ID",
    ogImage: defaultOgImage,
    twitterCard: "summary_large_image",
  });

  useHead({
    link: () => [{ rel: "canonical", href: canonical.value }],
    script: [
      {
        key: "site-jsonld",
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "JogjaKu — Pusaka Jiwa Mataram",
              url: siteUrl,
              description:
                "Portal panduan wisata, sejarah, budaya, kuliner, dan teknologi Kota Yogyakarta.",
              inLanguage: ["id", "en"],
            },
            {
              "@type": "Organization",
              name: "JogjaKu",
              url: siteUrl,
            },
          ],
        }),
      },
    ],
  });
});
