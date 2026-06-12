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

/** Ikki tilli matn (uz/ru) */
export type Localized = { uz: string; ru: string };

/** Mahsulot xususiyatlari (qidiruv filtri) */
export type FeatureId = "vitaminA" | "preservativeFree";

export type Product = {
  id: string;
  name: string;
  short: Localized;
  description: Localized;
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
 * Boshlang'ich (seed) katalog — faqat original ilova skrinshotlaridan
 * tasdiqlangan mahsulotlar. Taxminiy/soxta yozuvlar ataylab yo'q:
 * qolgan assortiment, suratlar va havolalarni distribyutor /admin
 * paneli orqali kiritadi. `url` faqat haqiqiy havola bo'lsa to'ldiriladi —
 * bo'sh qoldirilsa UI havola tugmalarini umuman ko'rsatmaydi.
 */
export const products: Product[] = [
  {
    id: "smile-40-premium-the-one-mild",
    name: "Smile 40 Premium THE ONE Mild",
    short: {
      uz: "Bitta tomchi — barcha asosiy belgilarga qarshi",
      ru: "Одни капли — против всех основных симптомов",
    },
    description: {
      uz: "Ko'z charchog'i, xiralik, qizarish va qichishishning umumiy sababi bo'lgan shox parda shikastini tiklashga qaratilgan keng tarkibli tomchi.",
      ru: "Капли широкого состава, направленные на восстановление повреждения роговицы — общей причины усталости глаз, помутнения, покраснения и зуда.",
    },
    symptoms: ["tired", "blur", "red", "itch"],
    cooling: 2,
    features: ["vitaminA", "preservativeFree"],
    scenes: ["naked"],
    recommendFor: ["moderate", "attention"],
  },
  {
    id: "smile-40-mediclear-dx",
    name: "Smile 40 MediClear DX",
    short: {
      uz: "Qichishish va qizarishga qarshi",
      ru: "Против зуда и покраснения",
    },
    description: {
      uz: "Qichishish, qizarish va ko'z yiringi bezovta qilganda — B6, A va E vitaminlari hamda tabiiy yallig'lanishga qarshi komponent bilan. Konservantsiz.",
      ru: "Когда беспокоят зуд, покраснение и выделения — с витаминами B6, A и E и природным противовоспалительным компонентом. Без консервантов.",
    },
    symptoms: ["itch", "red", "blur"],
    cooling: 4,
    features: ["vitaminA", "preservativeFree"],
    scenes: ["naked"],
    recommendFor: ["moderate", "attention"],
  },
];

/** Natija darajasiga mos mahsulotlarni qaytaradi */
export function recommendedProducts(
  catalog: Product[],
  level: "good" | "moderate" | "attention",
): Product[] {
  return catalog.filter((p) => p.recommendFor.includes(level));
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
export function searchProducts(
  catalog: Product[],
  c: SearchCriteria,
): {
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

  const strict = catalog.filter(
    (p) =>
      c.symptoms.every((s) => p.symptoms.includes(s)) &&
      p.symptoms.includes(c.primary) &&
      coolingOk(p) &&
      (c.scene === "any" || p.scenes.includes(c.scene)) &&
      c.features.every((f) => p.features.includes(f)),
  );
  if (strict.length > 0) return { products: strict, exact: true };

  return {
    products: catalog.filter((p) => p.symptoms.includes(c.primary)),
    exact: false,
  };
}
