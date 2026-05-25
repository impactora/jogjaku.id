type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export const setPageSeo = ({
  title,
  description,
  path,
  image = "/images/home/Tugu_Jogja-hero.jpg",
}: PageSeoInput) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const normalizedPath = path === "/" || path.endsWith("/") ? path : `${path}/`;
  const url =
    normalizedPath === "/" ? `${siteUrl}/` : `${siteUrl}${normalizedPath}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: "website",
    ogImage: imageUrl,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    robots: "index, follow",
  });

  useHead({
    link: [{ rel: "canonical", href: url }],
  });
};
