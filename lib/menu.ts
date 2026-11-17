import type { Locale } from "./sanity/types";

export type MenuItem = {
  id: string;
  en: string;
  ar: string;
  /** Number in EGP. null = no price shown (price to be confirmed). */
  price: number | null;
  /** Shown instead of a number, e.g. "75 – 150". */
  priceText?: string;
  noteEn?: string;
  noteAr?: string;
};

export type MenuGroup = {
  id: string;
  en: string;
  ar: string;
  /** Large heading shown above this group (the printed menu groups two cards under "Main Course"). */
  kickerEn?: string;
  kickerAr?: string;
  art?: "pizza" | "plate" | "glass" | "moka" | "cone" | "fish";
  /** A notice instead of items (the Seafood card). */
  noteEn?: string;
  noteAr?: string;
  items: MenuItem[];
};

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "grilled",
    en: "Grilled & Fried Meals",
    ar: "الوجبات المشوية والمقلية",
    kickerEn: "Main Course",
    kickerAr: "الأطباق الرئيسية",
    items: [
      { id: "g1", en: "Grilled Chicken on Charcoal (1/4)", ar: "فراخ مشوية على الفحم (١/٤)", price: 250 },
      { id: "g2", en: "Grilled Chicken on Charcoal (1/2)", ar: "فراخ مشوية على الفحم (١/٢)", price: 320 },
      { id: "g3", en: "Mixed Grill", ar: "ميكس جريل", price: 250 },
      { id: "g4", en: "Chicken Shawarma", ar: "شاورما فراخ", price: 250 },
      { id: "g5", en: "Meat Shawarma", ar: "شاورما لحمة", price: 300 },
      { id: "g6", en: "Shish Taouk", ar: "شيش طاووق", price: 250 },
      { id: "g7", en: "Pane Chicken", ar: "فراخ بانيه", price: 250 },
      { id: "g8", en: "Fried Chicken", ar: "فرايد تشيكن", price: 200 },
    ],
  },
  {
    id: "tagines",
    en: "Tagines & Maqluba",
    ar: "الطواجن والمقلوبة",
    items: [
      { id: "t1", en: "Okra Tagine", ar: "طاجن بامية", price: 70 },
      { id: "t2", en: "Zucchini Tagine", ar: "طاجن كوسة", price: 70 },
      { id: "t3", en: "Potato Tagine", ar: "طاجن بطاطس", price: 70 },
      { id: "t4", en: "Molokhia Tagine", ar: "طاجن ملوخية", price: 70 },
      { id: "t5", en: "Chicken Tagine", ar: "طاجن دجاج", price: 200 },
      { id: "t6", en: "Meat Tagine", ar: "طاجن لحم", price: 300 },
      { id: "t7", en: "Chicken Maqluba", ar: "مقلوبة دجاج", price: 250 },
      { id: "t8", en: "Meat Maqluba", ar: "مقلوبة لحم", price: 300 },
      { id: "t9", en: "Vegetable Maqluba", ar: "مقلوبة خضار", price: 200 },
    ],
  },
  {
    id: "pasta-pizza",
    en: "Pasta & Pizza",
    ar: "الباستا والبيتزا",
    art: "pizza",
    items: [
      { id: "p1", en: "White Sauce Pasta", ar: "باستا صوص أبيض", price: 250 },
      { id: "p2", en: "Seafood White Sauce Pasta", ar: "باستا سي فود صوص أبيض", price: 400 },
      { id: "p3", en: "Chicken White Sauce Pasta", ar: "باستا دجاج صوص أبيض", price: 300 },
      { id: "p4", en: "Meat White Sauce Pasta", ar: "باستا لحم صوص أبيض", price: 350 },
      { id: "p5", en: "Red Sauce Pasta", ar: "باستا صوص أحمر", price: 200 },
      { id: "p6", en: "Bolognese Red Sauce Pasta", ar: "باستا بولونيز صوص أحمر", price: 300 },
      { id: "p7", en: "Vegetable Pizza", ar: "بيتزا خضار", price: 250 },
      { id: "p8", en: "Margherita Pizza", ar: "بيتزا مارجريتا", price: 250 },
      { id: "p9", en: "Tuna Pizza", ar: "بيتزا تونة", price: 270 },
      { id: "p10", en: "Chicken Pizza", ar: "بيتزا دجاج", price: 300 },
      { id: "p11", en: "Meat Pizza", ar: "بيتزا لحم", price: 320 },
      { id: "p12", en: "Seafood Pizza", ar: "بيتزا سي فود", price: 400 },
    ],
  },
  {
    id: "seafood",
    en: "Seafood",
    ar: "المأكولات البحرية",
    art: "fish",
    noteEn: "Kindly note that our seafood dishes are freshly prepared upon order to ensure the highest quality and taste.",
    noteAr: "جميع أطباق المأكولات البحرية تحضر خصيصًا عند الطلب لضمان تجربة طازجة بأعلى جودة.",
    items: [],
  },
  {
    id: "sides",
    en: "Sides",
    ar: "الإضافات",
    art: "plate",
    items: [
      { id: "s1", en: "Rice", ar: "أرز", price: 60 },
      { id: "s2", en: "Hummus", ar: "حمص", price: 70 },
      { id: "s3", en: "Tahini", ar: "طحينة", price: 70 },
      { id: "s4", en: "Green Salad", ar: "سلطة خضراء", price: 70 },
      { id: "s5", en: "Tuna Salad", ar: "سلطة تونة", price: 70 },
      { id: "s6", en: "Baba Ghanoush", ar: "بابا غنوج", price: 70 },
      // CONFIRM: English menu says 90, Arabic menu says 70. Price hidden until the owner decides.
      { id: "s7", en: "Medium French Fries", ar: "بطاطس مقلية وسط", price: null },
      { id: "s8", en: "Large French Fries", ar: "بطاطس مقلية كبيرة", price: 120 },
      // CONFIRM: English menu says 55, Arabic menu says 75.
      { id: "s9", en: "Vegetable Soup", ar: "شوربة خضار", price: null },
      // CONFIRM: English menu says 45, Arabic menu says 75.
      { id: "s10", en: "Orzo Soup (Lisan Asfour)", ar: "شوربة لسان عصفور", price: null },
    ],
  },
  {
    id: "cold-drinks",
    en: "Cold Drinks",
    ar: "المشروبات الباردة",
    art: "glass",
    items: [
      {
        id: "c1", en: "Fresh Juices", ar: "عصائر فريش", price: null, priceText: "75 – 150",
        noteEn: "Orange, Mango, Strawberry, Cantaloupe, Kiwi …", noteAr: "برتقال، مانجو، فراولة، كنتالوب، كيوي...",
      },
      { id: "c2", en: "Lemonade", ar: "عصير ليمون", price: 75 },
      { id: "c3", en: "Yahoo Juice", ar: "عصير ياهو", price: 35 },
      { id: "c4", en: "Soda Can", ar: "مشروبات غازية", price: 45 },
      { id: "c5", en: "Red Bull", ar: "ريد بول", price: 75 },
      // No price on either printed menu.
      { id: "c6", en: "Iced Tea", ar: "آيس تي", price: null },
      { id: "c7", en: "Iced Coffee", ar: "آيس كوفي", price: 60 },
      { id: "c8", en: "Iced Karkadeh", ar: "كركديه ساقع", price: 35 },
      { id: "c9", en: "Large Water", ar: "مياه كبيرة", price: 30 },
      { id: "c10", en: "Small Water", ar: "مياه صغيرة", price: 15 },
    ],
  },
  {
    id: "hot-drinks",
    en: "Hot Drinks",
    ar: "المشروبات الساخنة",
    art: "moka",
    items: [
      { id: "h1", en: "Tea", ar: "شاي", price: 35 },
      { id: "h2", en: "Milk Tea", ar: "شاي بالحليب", price: 40 },
      { id: "h3", en: "Green Tea", ar: "شاي أخضر", price: 40 },
      { id: "h4", en: "Herbal Tea", ar: "أعشاب", price: 40 },
      { id: "h5", en: "Teapot", ar: "براد شاي", price: 50 },
      { id: "h6", en: "Turkish Coffee", ar: "قهوة تركي", price: 45 },
      { id: "h7", en: "Turkish Coffee with Milk", ar: "قهوة تركي بالحليب", price: 60 },
      { id: "h8", en: "Nescafé Black", ar: "نسكافيه بلاك", price: 50 },
      { id: "h9", en: "Nescafé with Milk", ar: "نسكافيه بالحليب", price: 60 },
      { id: "h10", en: "Hot Chocolate", ar: "هوت شوكليت", price: 60 },
      { id: "h11", en: "Egyptian Sahleb", ar: "سحلب مصري", price: 45 },
    ],
  },
  {
    id: "desserts",
    en: "Desserts",
    ar: "الحلويات",
    art: "cone",
    items: [
      { id: "d1", en: "Fruit Salad", ar: "سلطة فواكه", price: 90 },
      { id: "d2", en: "Ice Cream", ar: "آيس كريم", price: 120 },
      { id: "d3", en: "Pancake", ar: "بان كيك", price: 120 },
      { id: "d4", en: "Rice Pudding", ar: "أرز باللبن", price: 50 },
      { id: "d5", en: "Mahallabia (Milk Pudding)", ar: "مهلبية", price: 50 },
      { id: "d6", en: "Custard", ar: "كاستارد", price: 40 },
      { id: "d7", en: "Um Ali", ar: "أم علي", price: null, priceText: "100 / 170" },
    ],
  },
];

/** Interface text for the menu page. */
export const MENU_TEXT = {
  en: {
    nav: "Menu",
    title: "Menu",
    place: "Leley Camp · Nuweiba",
    seoTitle: "Menu | Leley Camp, Nuweiba",
    seoDescription: "Food and drinks at Leley Camp in Nuweiba: grilled meals, tagines, pasta, pizza, seafood, juices, coffee and desserts. Send your request on WhatsApp.",
    hint: "Tap + to add what you'd like, then send your request on WhatsApp.",
    currency: "EGP",
    chips: "Menu sections",
    add: "Add",
    increase: "Add one more",
    decrease: "Remove one",
    yourRequest: "Your request",
    review: "Review & send",
    items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
    total: "Total",
    totalNote: "Items without a listed price aren't included in the total.",
    priceOnRequest: "price to confirm",
    notes: "Notes (optional)",
    notesHint: "Juice flavour, no onions, allergies…",
    send: "Send on WhatsApp",
    clear: "Clear all",
    close: "Close",
    empty: "Nothing added yet.",
    greeting: "Hello Leley Camp, I'd like to request:",
    msgTotal: "Total",
    msgPlus: "plus items priced on confirmation",
    msgNotes: "Notes",
    msgName: "Name / cabin number:",
  },
  ar: {
    nav: "المنيو",
    title: "المنيو",
    place: "ليلي كامب · نويبع",
    seoTitle: "المنيو | ليلي كامب، نويبع",
    seoDescription: "أطباق ومشروبات ليلي كامب في نويبع: مشويات، طواجن، باستا، بيتزا، مأكولات بحرية، عصائر، قهوة وحلويات. ابعت طلبك على واتساب.",
    hint: "اضغط + لإضافة ما تحب، ثم أرسل طلبك على واتساب.",
    currency: "جنيه",
    chips: "أقسام المنيو",
    add: "إضافة",
    increase: "زيادة واحد",
    decrease: "إنقاص واحد",
    yourRequest: "طلبك",
    review: "راجع وأرسل",
    items: (n: number) => (n === 1 ? "صنف واحد" : n === 2 ? "صنفان" : n <= 10 ? `${n} أصناف` : `${n} صنفًا`),
    total: "الإجمالي",
    totalNote: "الأصناف التي بلا سعر مكتوب غير محسوبة في الإجمالي.",
    priceOnRequest: "السعر يُؤكَّد",
    notes: "ملاحظات (اختياري)",
    notesHint: "نوع العصير، بدون بصل، حساسية…",
    send: "أرسل على واتساب",
    clear: "مسح الكل",
    close: "إغلاق",
    empty: "لم تضف شيئًا بعد.",
    greeting: "أهلًا ليلي كامب، أريد طلب:",
    msgTotal: "الإجمالي",
    msgPlus: "بالإضافة إلى أصناف يُؤكَّد سعرها",
    msgNotes: "ملاحظات",
    msgName: "الاسم / رقم الكابينة:",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export type MenuText = (typeof MENU_TEXT)["en"] | (typeof MENU_TEXT)["ar"];
