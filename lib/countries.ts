// Country calling codes for the phone field's country picker. Flags are computed
// from the ISO code (two regional-indicator symbols) rather than typed by hand,
// so there is nothing here to get wrong or keep in sync — see flagEmoji() below.
export type Country = { iso: string; name: string; dial: string };

export function flagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + (c.charCodeAt(0) - 65)))
    .join("");
}

export const COUNTRIES: Country[] = [
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "JO", name: "Jordan", dial: "+962" },
  { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "IQ", name: "Iraq", dial: "+964" },
  { iso: "SY", name: "Syria", dial: "+963" },
  { iso: "PS", name: "Palestine", dial: "+970" },
  { iso: "YE", name: "Yemen", dial: "+967" },
  { iso: "LY", name: "Libya", dial: "+218" },
  { iso: "SD", name: "Sudan", dial: "+249" },
  { iso: "TN", name: "Tunisia", dial: "+216" },
  { iso: "DZ", name: "Algeria", dial: "+213" },
  { iso: "MA", name: "Morocco", dial: "+212" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "BE", name: "Belgium", dial: "+32" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "AT", name: "Austria", dial: "+43" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "PL", name: "Poland", dial: "+48" },
  { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "CZ", name: "Czechia", dial: "+420" },
  { iso: "RO", name: "Romania", dial: "+40" },
  { iso: "HU", name: "Hungary", dial: "+36" },
  { iso: "UA", name: "Ukraine", dial: "+380" },
  { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "CY", name: "Cyprus", dial: "+357" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "TW", name: "Taiwan", dial: "+886" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "ET", name: "Ethiopia", dial: "+251" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "AR", name: "Argentina", dial: "+54" },
  { iso: "CL", name: "Chile", dial: "+56" },
  { iso: "CO", name: "Colombia", dial: "+57" },
  { iso: "PE", name: "Peru", dial: "+51" },
].sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY = "+20";

/** Splits a stored full number (e.g. "+201111509666") back into its country code and
 * local digits, so a recognized returning customer's number can prefill the compound
 * phone field correctly. Longer dial codes are checked first so e.g. "+1" doesn't
 * swallow a number that actually starts with a longer code. */
export function splitPhone(full: string): { dial: string; local: string } {
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (full.startsWith(c.dial)) return { dial: c.dial, local: full.slice(c.dial.length) };
  }
  return { dial: DEFAULT_COUNTRY, local: full.replace(/^\+?20?/, "") };
}
