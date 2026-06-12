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

export type Product = {
  id: string;
  name: string;
  short: string;
  description: string;
  /** Qaysi natija darajalarida tavsiya qilinadi */
  recommendFor: Array<"good" | "moderate" | "attention">;
  /** Tashqi sahifa (do'kon, batafsil ma'lumot) */
  url?: string;
};

/**
 * LION «Smile» liniyasi. Aniq assortiment, nomlar va matnlarni
 * distribyutor tasdiqlashi kerak; url hozircha to'ldirilmagan.
 */
export const products: Product[] = [
  {
    id: "smile-medical-a",
    name: "Smile The Medical A",
    short: "Shox parda tiklanishiga ko'mak",
    description:
      "Tarkibidagi A vitamini (retinol) shox parda yuzasining tabiiy tiklanishini qo'llab-quvvatlaydi — ekran oldida uzoq ishlaydiganlar uchun.",
    recommendFor: ["moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-40ex",
    name: "Smile 40 EX",
    short: "Charchoq va xiralikka qarshi vitaminli tomchi",
    description:
      "Vitaminlar va aminokislotalar kompleksi ko'z charchog'ini yengillashtiradi va xiralikni kamaytirishga yordam beradi.",
    recommendFor: ["good", "moderate", "attention"],
    url: "#",
  },
  {
    id: "smile-contact",
    name: "Smile Contact EX",
    short: "Linza taquvchilar uchun namlovchi tomchi",
    description:
      "Kontakt linza taqqan holda ham ishlatish mumkin bo'lgan namlovchi tomchi — quruqshash va noqulaylikni yumshatadi.",
    recommendFor: ["good", "moderate"],
    url: "#",
  },
];

/** Natija darajasiga mos birinchi mahsulotni qaytaradi */
export function recommendedProducts(
  level: "good" | "moderate" | "attention",
): Product[] {
  return products.filter((p) => p.recommendFor.includes(level));
}
