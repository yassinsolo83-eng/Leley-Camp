export type Locale = "en" | "ar";

export type Localized = { en?: string; ar?: string } | undefined | null;

export type SanityImage = {
  _type?: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: unknown;
  crop?: unknown;
};

export type SectionHeading = { tag?: Localized; title?: Localized; subtitle?: Localized };

export type SiteSettings = {
  campName?: string;
  logo?: SanityImage;
  footerText?: Localized;
  rating?: number;
  reviewCount?: number;
  whatsappNumber?: string;
  whatsappMessage?: Localized;
  phoneDisplay?: string;
  mapsUrl?: string;
  bookingUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  vrTourUrl?: string;
  siteUrl?: string;
  metaTitle?: Localized;
  metaDescription?: Localized;
  ogImage?: SanityImage;
  gaId?: string;
};

export type PageHeader = { title?: Localized; intro?: Localized; image?: SanityImage };

export type GalleryEntry = { _key: string; image?: SanityImage; alt?: Localized; wide?: boolean };

export type HomePage = {
  hero?: { badge?: Localized; title?: Localized; subtitle?: Localized; image?: SanityImage };
  vrSection?: { title?: Localized; subtitle?: Localized };
  about?: {
    heading?: SectionHeading;
    paragraphs?: Localized[];
    image?: SanityImage;
    stats?: { _key: string; value?: string; label?: Localized }[];
  };
  cabinsHeading?: SectionHeading;
  activitiesHeading?: SectionHeading;
  reviewsHeading?: SectionHeading;
  galleryHeading?: SectionHeading;
  ctaBand?: { title?: Localized; subtitle?: Localized };
  gallery?: GalleryEntry[];
  videoUrl?: string;
  videoPoster?: SanityImage;
};

export type Pages = {
  cabins?: PageHeader;
  experiences?: PageHeader;
  gallery?: PageHeader;
  videoHeading?: SectionHeading;
  booking?: PageHeader;
  pricesHeading?: SectionHeading;
  formHeading?: SectionHeading;
  about?: PageHeader;
  contactHeading?: SectionHeading;
};

export type Cabin = {
  _id: string;
  slug?: string;
  name?: Localized;
  description?: Localized;
  tag?: Localized;
  image?: SanityImage;
  details?: Localized[];
  amenities?: Localized[];
  photos?: (SanityImage & { _key: string })[];
};
export type Activity = { _id: string; name?: Localized; description?: Localized; icon?: string; image?: SanityImage };
export type PricePlan = {
  _id: string;
  name?: Localized;
  price?: number;
  currency?: string;
  unit?: Localized;
  features?: Localized[];
  featured?: boolean;
  badge?: Localized;
};
export type Review = {
  _id: string;
  author?: string;
  text?: string;
  rating?: number;
  source?: string;
  badge?: string;
  date?: string;
};

export type Labels = Record<string, Localized>;

export type PageData = {
  settings: SiteSettings | null;
  home: HomePage | null;
  pages: Pages | null;
  labels: Labels | null;
  cabins: Cabin[];
  activities: Activity[];
  prices: PricePlan[];
  reviews: Review[];
};
