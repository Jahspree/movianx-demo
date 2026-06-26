// Shared metadata builder for the public supporting pages. Keeps titles, descriptions,
// canonicals, Open Graph, and Twitter cards consistent without repeating boilerplate.
// metadataBase is set on the root layout, so relative paths below resolve to absolute URLs.

const SITE = "Movianx";
const OG_IMAGE = "/movianx-logo.png";

export function pageMeta({ path, title, description }) {
  const fullTitle = `${title} — ${SITE}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE,
      type: "website",
      images: [{ url: OG_IMAGE, alt: "Movianx" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
