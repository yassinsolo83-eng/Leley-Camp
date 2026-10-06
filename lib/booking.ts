import type { Locale } from "./sanity/types";

// The Studio's internal status (New/Contacted/Confirmed/Cancelled) is for the admin.
// A guest only ever sees one of these three simplified states.
const STATUS_LABELS: Record<Locale, Record<string, string>> = {
  en: { new: "Under review", contacted: "Under review", confirmed: "Confirmed", cancelled: "Cancelled" },
  ar: { new: "قيد المراجعة", contacted: "قيد المراجعة", confirmed: "تم التأكيد", cancelled: "تم الإلغاء" },
};

export function guestStatusLabel(status: string, lang: Locale): string {
  return STATUS_LABELS[lang]?.[status] || STATUS_LABELS.en[status] || status;
}

// A booking still "blocks" a new one as long as it hasn't been cancelled.
export const ACTIVE_STATUSES = ["new", "contacted", "confirmed"];
