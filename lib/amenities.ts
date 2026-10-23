// The fixed, tick-box amenities every cabin can have (as opposed to free-text ones
// typed per cabin). Each `value` is stored in Sanity; `labelKey` points at its
// translated label in lib/i18n.ts, editable from "Interface text" in the Studio.
export const STANDARD_AMENITIES = [
  { value: "singleBed", labelKey: "amenitySingleBed" },
  { value: "twinBed", labelKey: "amenityTwinBed" },
  { value: "balcony", labelKey: "amenityBalcony" },
  { value: "ac", labelKey: "amenityAc" },
  { value: "privateBathroom", labelKey: "amenityPrivateBathroom" },
] as const;

export type StandardAmenityValue = (typeof STANDARD_AMENITIES)[number]["value"];
