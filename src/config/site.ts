/**
 * Brend va mahsulot sozlamalari — bitta joydan boshqariladi.
 * Brendingiz / mahsulotlaringiz o'zgarsa faqat shu faylni tahrirlang.
 */

export const site = {
  brand: "EyeCare",
  title: "Ko'z tekshiruvi",
  /** Hero sarlavhadagi qavs ichiga olinadigan so'z */
  bracketWord: "Ko'z",
  tagline: "10 soniyada ko'z salomatligi tekshiruvi!",
  description:
    "AI yordamida ko'z holatini tezkor tekshiring va sinovdan o'tgan davo vositalarimiz bilan tanishing.",
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

export const products: Product[] = [
  {
    id: "eyecare-drops",
    name: "EyeCare ko'z tomchisi",
    short: "Qizarish va charchoqni yumshatadi",
    description:
      "Klinik sinovdan o'tgan tarkib: ko'z qizarishini kamaytiradi, namlaydi va uzoq ekran oldida ishlagandagi charchoqni yengillashtiradi.",
    recommendFor: ["moderate", "attention"],
    url: "#",
  },
  {
    id: "eyecare-moist",
    name: "EyeCare Moist namlovchi tomchi",
    short: "Quruqshashga qarshi kundalik namlik",
    description:
      "Ko'z quruqshashini his qilganlar uchun kundalik namlovchi tomchi. Linza taqqanlar ham ishlatishi mumkin.",
    recommendFor: ["good", "moderate"],
    url: "#",
  },
  {
    id: "eyecare-vita",
    name: "EyeCare Vita vitamin kompleksi",
    short: "Ko'z salomatligini ichdan quvvatlaydi",
    description:
      "Lyutein, zeaksantin va A vitamini bilan boyitilgan kompleks — ko'rish charchog'ining oldini olishga yordam beradi.",
    recommendFor: ["good", "moderate", "attention"],
    url: "#",
  },
];

/** Natija darajasiga mos birinchi mahsulotni qaytaradi */
export function recommendedProducts(
  level: "good" | "moderate" | "attention",
): Product[] {
  return products.filter((p) => p.recommendFor.includes(level));
}
