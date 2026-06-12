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

/** Foydalanish holati: linzasiz / yumshoq / qattiq linza bilan */
export type SceneId = "naked" | "soft" | "hard";

/** Mahsulot xususiyatlari (qidiruv filtri) */
export type FeatureId = "vitaminA" | "preservativeFree";

export type Product = {
  id: string;
  name: string;
  short: string;
  description: string;
  /** Qaysi belgilarda tavsiya qilinadi (tomchi qidiruvi mosligi) */
  symptoms: SymptomId[];
  /** Salqinlik darajasi, 0–7 (originaldagi 清涼感 yulduzlari) */
  cooling: number;
  features: FeatureId[];
  /** Qaysi holatlarda tomizish mumkin */
  scenes: SceneId[];
  /** Qaysi natija darajalarida tavsiya qilinadi */
  recommendFor: Array<"good" | "moderate" | "attention">;
  /** public/ dagi mahsulot surati (hozircha yo'q — placeholder chiqadi) */
  image?: string;
  /** Tashqi sahifa (do'kon, brend sahifasi) */
  url?: string;
};

/**
 * LION «Smile» liniyasi. Skrinshotlardan tasdiqlanganlari:
 * 40 Premium THE ONE Mild (salqinlik 2/7, A vitamini, konservantsiz)
 * va 40 MediClear DX (konservantsiz). Qolgan qiymatlar taxminiy —
 * aniq assortiment, salqinlik darajalari, matn va havolalarni
 * distribyutor tasdiqlashi kerak.
 */
export const products: Product[] = [
  {
    id: "smile-40-premium-the-one-mild",
    name: "Smile 40 Premium THE ONE Mild",
    short: "Bitta tomchi — barcha asosiy belgilarga qarshi",
    description:
      "Ko'z charchog'i, xiralik, qizarish va qichishishning umumiy sababi bo'lgan shox parda shikastini tiklashga qaratilgan keng tarkibli tomchi.",
    symptoms: ["tired", "blur", "red", "itch"],
    cooling: 2,
    features: ["vitaminA", "preservativeFree"],
    scenes: ["naked"],
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
    cooling: 4,
    features: ["vitaminA", "preservativeFree"],
    scenes: ["naked"],
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
    cooling: 1,
    features: ["vitaminA"],
    scenes: ["naked"],
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
    cooling: 5,
    features: ["vitaminA"],
    scenes: ["naked"],
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
    cooling: 3,
    features: ["preservativeFree"],
    scenes: ["naked", "soft", "hard"],
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

export type SearchCriteria = {
  symptoms: SymptomId[];
  primary: SymptomId;
  cooling: "any" | "none" | "mild" | "strong";
  scene: "any" | SceneId;
  features: FeatureId[];
};

/**
 * Originaldagidek qidiruv: avval barcha shartlar bo'yicha qat'iy filtr;
 * hech narsa topilmasa — faqat «eng bezovta qilgan belgi» bo'yicha
 * moslar qaytariladi (exact: false).
 */
export function searchProducts(c: SearchCriteria): {
  products: Product[];
  exact: boolean;
} {
  const coolingOk = (p: Product) =>
    c.cooling === "any"
      ? true
      : c.cooling === "none"
        ? p.cooling === 0
        : c.cooling === "mild"
          ? p.cooling >= 1 && p.cooling <= 3
          : p.cooling >= 4;

  const strict = products.filter(
    (p) =>
      c.symptoms.every((s) => p.symptoms.includes(s)) &&
      p.symptoms.includes(c.primary) &&
      coolingOk(p) &&
      (c.scene === "any" || p.scenes.includes(c.scene)) &&
      c.features.every((f) => p.features.includes(f)),
  );
  if (strict.length > 0) return { products: strict, exact: true };

  return {
    products: products.filter((p) => p.symptoms.includes(c.primary)),
    exact: false,
  };
}
