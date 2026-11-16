import { groq } from "next-sanity";

export const pageQuery = groq`{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0]{
    ...,
    "videoUrl": video.asset->url,
    galleryVideos[]{ ..., "videoUrl": video.asset->url }
  },
  "pages": *[_id == "pages"][0],
  "legal": *[_id == "legalPages"][0],
  "labels": *[_id == "interfaceText"][0],
  "cabins": *[_type == "cabin" && defined(slug.current)] | order(order asc, _createdAt asc){
    ...,
    "slug": slug.current,
    "blockedDates": *[_type == "blockedDate" && references(^._id)]{ from, to, note }
  },
  "activities": *[_type == "activity"] | order(order asc, _createdAt asc),
  "prices": *[_type == "pricePlan" && active != false] | order(order asc, _createdAt asc),
  "reviews": *[_type == "review"] | order(order asc, date desc),
  "updatedAt": *[_type in ["siteSettings", "homePage", "pages", "legalPages", "interfaceText", "cabin", "activity", "pricePlan", "review"]] | order(_updatedAt desc)[0]._updatedAt,
  "offers": *[_type == "offer" && active != false && defined(plan) && endDate > $today] | order(order asc, _createdAt asc){
    _id, title, description, image, startDate, endDate, priceEgyptian, priceForeigner, currency, unit, tickerText,
    "planName": plan->name
  }
}`;
