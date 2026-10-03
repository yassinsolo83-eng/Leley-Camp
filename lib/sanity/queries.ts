import { groq } from "next-sanity";

export const pageQuery = groq`{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0]{ ..., "videoUrl": video.asset->url },
  "labels": *[_id == "interfaceText"][0],
  "cabins": *[_type == "cabin"] | order(order asc, _createdAt asc),
  "activities": *[_type == "activity"] | order(order asc, _createdAt asc),
  "prices": *[_type == "pricePlan" && active != false] | order(order asc, _createdAt asc),
  "reviews": *[_type == "review"] | order(order asc, date desc)
}`;
