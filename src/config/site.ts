/**
 * Brend va mahsulot sozlamalari — bitta joydan boshqariladi.
 * Brendingiz / mahsulotlaringiz o'zgarsa faqat shu faylni tahrirlang.
 *
 * Ilova — LION «Smile» shox parda tekshiruvi ilovasining o'zbekcha
 * moslamasi (rasmiy distribyutor uchun).
 */

export const site = {
  brand: "Smile",
  title: "Shox parda tekshiruvi",
  /** Hero sarlavhadagi qavs ichiga olinadigan so'z */
  bracketWord: "Shox parda",
  tagline: "10 soniyada ko'z salomatligi tekshiruvi!",
  description:
    "AI yordamida ko'z holatini tezkor tekshiring va LION «Smile» ko'z tomchilari bilan tanishing.",
} as const;

/** Tomchi qidiruvi so'rovnomasida ishlatiladigan belgi identifikatorlari */
export type SymptomId =
  | "tired"
  | "dry"
  | "blur"
  | "itch"
  | "red"
  | "contact";

export type Product = {
  id: string;
  name: string;
  short: string;
  description: string;
  /** Qaysi belgilarda tavsiya qilinadi (tomchi qidiruvi mosligi) */
  symptoms: SymptomId[];
  /** Qaysi natija darajalarida tavsiya qilinadi */
  recommendFor: Array<"good" | "moderate" | "attention">;
  /** public/ dagi mahsulot surati (hozircha yo'q — placeholder chiqadi) */
  image?: string;
  /** Tashqi sahifa (do'kon, brend sahifasi) */
  url?: string;
};

/**
 * LION «Smile» liniyasi. Skrinshotlardan tasdiqlanganlari:
 * 40 Premium THE ONE Mild va 40 MediClear DX; qolganlari taxminiy —
 * aniq assortiment, matn va havolalarni distribyutor tasdiqlashi kerak.
 */
export const products: Product[] = [
  {
    id: "smile-40-premium-the-one-mild",
    name: "Smile 40 Premium THE ONE Mild",
    short: "Shox parda tiklanishi uchun flagman tomchi",
    description:
      "Ko'z charchog'i, xiralik, qizarish va qichishishning umumiy sababi bo'lgan shox parda shikastini tiklashga qaratilgan keng tarkibli tomchi.",
    symptoms: ["tired", "blur", "red", "itch"],
    recommendFor: ["moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-40-mediclear-dx",
    name: "Smile 40 MediClear DX",
    short: "Qichishish va qizarishga qarshi",
    description:
      "Qichishish, qizarish va ko'z yiringi bezovta qilganda — B6, A va E vitaminlari hamda tabiiy yallig'lanishga qarshi komponent bilan. Konservantsiz.",
    symptoms: ["itch", "red", "blur"],
    recommendFor: ["moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-medical-a",
    name: "Smile The Medical A",
    short: "Shox parda tiklanishiga ko'mak",
    description:
      "Tarkibidagi A vitamini (retinol) shox parda yuzasining tabiiy tiklanishini qo'llab-quvvatlaydi — ekran oldida uzoq ishlaydiganlar uchun.",
    symptoms: ["dry", "tired", "blur"],
    recommendFor: ["moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-40ex",
    name: "Smile 40 EX",
    short: "Charchoq va xiralikka qarshi vitaminli tomchi",
    description:
      "Vitaminlar va aminokislotalar kompleksi ko'z charchog'ini yengillashtiradi va xiralikni kamaytirishga yordam beradi.",
    symptoms: ["tired", "blur", "itch"],
    recommendFor: ["good", "moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-contact",
    name: "Smile Contact EX",
    short: "Linza taquvchilar uchun namlovchi tomchi",
    description:
      "Kontakt linza taqqan holda ham ishlatish mumkin bo'lgan namlovchi tomchi — quruqshash va noqulaylikni yumshatadi.",
    symptoms: ["contact", "dry"],
    recommendFor: ["good", "moderate"],
    url: "#",
  },
];

/** Natija darajasiga mos mahsulotlarni qaytaradi */
export function recommendedProducts(
  level: "good" | "moderate" | "attention",
): Product[] {
  return products.filter((p) => p.recommendFor.includes(level));
}

/** Tanlangan belgilarga eng mos tomchilarni saralab qaytaradi */
export function matchProducts(
  symptoms: SymptomId[],
  wearsLenses: boolean,
): Product[] {
  const scored = products
    .map((p) => {
      let score = p.symptoms.filter((s) => symptoms.includes(s)).length;
      if (wearsLenses && p.symptoms.includes("contact")) score += 2;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.length ? scored.map((x) => x.p) : products;
}
