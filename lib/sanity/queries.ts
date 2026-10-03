import { groq } from "next-sanity";

export const pageQuery = groq`{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0]{ ..., "videoUrl": video.asset->url },
  "pages": *[_id == "pages"][0],
  "labels": *[_id == "interfaceText"][0],
  "cabins": *[_type == "cabin" && defined(slug.current)] | order(order asc, _createdAt asc){ ..., "slug": slug.current },
  "activities": *[_type == "activity"] | order(order asc, _createdAt asc),
  "prices": *[_type == "pricePlan" && active != false] | order(order asc, _createdAt asc),
  "reviews": *[_type == "review"] | order(order asc, date desc)
}`;
