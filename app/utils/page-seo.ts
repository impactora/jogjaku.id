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
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;
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
