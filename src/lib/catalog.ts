/**
 * Mahsulot katalogi saqlash qatlami (faqat serverda ishlaydi).
 *
 * Katalog Vercel Blob'da `catalog/products.json` sifatida saqlanadi.
 * Blob ulanmagan bo'lsa (BLOB_READ_WRITE_TOKEN yo'q) yoki o'qishda xato
 * bo'lsa, `site.ts` dagi boshlang'ich (seed) ro'yxat qaytariladi — sayt
 * hech qachon mahsulotsiz qolmaydi.
 */
import { list, put } from "@vercel/blob";
import {
  products as seedProducts,
  type FeatureId,
  type Product,
  type SceneId,
  type SymptomId,
} from "@/config/site";

const BLOB_PATH = "catalog/products.json";

const SYMPTOM_IDS: SymptomId[] = ["tired", "dry", "blur", "itch", "red", "contact"];
const SCENE_IDS: SceneId[] = ["naked", "soft", "hard"];
const FEATURE_IDS: FeatureId[] = ["vitaminA", "preservativeFree"];
const LEVELS = ["good", "moderate", "attention"] as const;

export function storageReady(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isLocalized(v: unknown): v is { uz: string; ru: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as Record<string, unknown>).uz === "string" &&
    typeof (v as Record<string, unknown>).ru === "string"
  );
}

function subset<T extends string>(v: unknown, allowed: readonly T[]): v is T[] {
  return Array.isArray(v) && v.every((x) => allowed.includes(x as T));
}

/** Bitta mahsulot obyektini tekshiradi; noto'g'ri bo'lsa null */
export function validateProduct(v: unknown): Product | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const cooling = Number(o.cooling);
  if (
    typeof o.id !== "string" ||
    !/^[a-z0-9-]{2,64}$/.test(o.id) ||
    typeof o.name !== "string" ||
    o.name.trim().length === 0 ||
    o.name.length > 120 ||
    !isLocalized(o.short) ||
    !isLocalized(o.description) ||
    !subset(o.symptoms, SYMPTOM_IDS) ||
    !Number.isFinite(cooling) ||
    cooling < 0 ||
    cooling > 7 ||
    !subset(o.features, FEATURE_IDS) ||
    !subset(o.scenes, SCENE_IDS) ||
    !subset(o.recommendFor, LEVELS)
  ) {
    return null;
  }
  const image = typeof o.image === "string" && o.image ? o.image : undefined;
  // «#» kabi soxta havolalar saqlanmaydi — UI tugmani umuman ko'rsatmaydi
  const url =
    typeof o.url === "string" && /^https?:\/\//.test(o.url) ? o.url : undefined;
  return {
    id: o.id,
    name: o.name.trim(),
    short: { uz: o.short.uz, ru: o.short.ru },
    description: { uz: o.description.uz, ru: o.description.ru },
    symptoms: o.symptoms,
    cooling: Math.round(cooling),
    features: o.features,
    scenes: o.scenes,
    recommendFor: o.recommendFor,
    image,
    url,
  };
}

export function validateCatalog(v: unknown): Product[] | null {
  if (!Array.isArray(v) || v.length === 0 || v.length > 100) return null;
  const items: Product[] = [];
  const seen = new Set<string>();
  for (const raw of v) {
    const p = validateProduct(raw);
    if (!p || seen.has(p.id)) return null;
    seen.add(p.id);
    items.push(p);
  }
  return items;
}

/** Joriy katalog: Blob'dagi versiya, bo'lmasa seed */
export async function getCatalog(): Promise<Product[]> {
  if (!storageReady()) return seedProducts;
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (blobs.length === 0) return seedProducts;
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return seedProducts;
    return validateCatalog(await res.json()) ?? seedProducts;
  } catch {
    return seedProducts;
  }
}

export async function saveCatalog(items: Product[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
