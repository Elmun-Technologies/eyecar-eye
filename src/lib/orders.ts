/**
 * Buyurtmalar (zayavkalar) saqlash qatlami (faqat serverda ishlaydi).
 *
 * Har bir buyurtma alohida blob fayl sifatida saqlanadi
 * (`orders/{id}.json`) — bir vaqtda kelgan ikkita buyurtma bir-birini
 * yozib yubormaydi. Katalog kabi BLOB_READ_WRITE_TOKEN talab qilinadi.
 */
import { del, list, put } from "@vercel/blob";
import { storageReady } from "@/lib/catalog";

export type OrderStatus = "new" | "done";

export type Order = {
  id: string;
  productId: string;
  productName: string;
  name: string;
  phone: string;
  lang: "uz" | "ru";
  status: OrderStatus;
  createdAt: number;
};

const PREFIX = "orders/";
const ID_RE = /^[0-9]{10,16}-[a-z0-9]{4,12}$/;

function pathFor(id: string): string {
  return `${PREFIX}${id}.json`;
}

export type OrderInput = {
  productId: string;
  productName: string;
  name: string;
  phone: string;
  lang: "uz" | "ru";
};

/** Foydalanuvchi kiritgan ma'lumotni tekshirib, tozalab qaytaradi */
export function validateOrderInput(v: unknown): OrderInput | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const phoneRaw = typeof o.phone === "string" ? o.phone : "";
  // Telefon: + va raqamlardan boshqasini olib tashlaymiz
  const phone = phoneRaw.replace(/[^\d+]/g, "");
  const digits = phone.replace(/\D/g, "");
  const productId =
    typeof o.productId === "string" ? o.productId.slice(0, 64) : "";
  const productName =
    typeof o.productName === "string" ? o.productName.trim().slice(0, 120) : "";
  const lang = o.lang === "ru" ? "ru" : "uz";
  if (
    name.length < 2 ||
    name.length > 80 ||
    digits.length < 9 ||
    digits.length > 15 ||
    productName.length === 0
  ) {
    return null;
  }
  return { productId, productName, name, phone, lang };
}

export async function saveOrder(input: OrderInput): Promise<Order> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const order: Order = {
    id,
    ...input,
    status: "new",
    createdAt: Date.now(),
  };
  await put(pathFor(id), JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  return order;
}

/** Eng so'nggi buyurtmalar (yangisi birinchi), ko'pi bilan 200 ta */
export async function listOrders(): Promise<Order[]> {
  if (!storageReady()) return [];
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const newest = blobs
    .sort((a, b) => (a.pathname < b.pathname ? 1 : -1))
    .slice(0, 200);
  const orders = await Promise.all(
    newest.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as Order;
      } catch {
        return null;
      }
    }),
  );
  return orders.filter((o): o is Order => o !== null && typeof o.id === "string");
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<boolean> {
  if (!ID_RE.test(id)) return false;
  const { blobs } = await list({ prefix: pathFor(id), limit: 1 });
  if (blobs.length === 0) return false;
  const res = await fetch(blobs[0].url, { cache: "no-store" });
  if (!res.ok) return false;
  const order = (await res.json()) as Order;
  order.status = status;
  await put(pathFor(id), JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!ID_RE.test(id)) return false;
  await del(pathFor(id));
  return true;
}

/**
 * Ixtiyoriy Telegram xabarnomasi: TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID
 * o'rnatilgan bo'lsa, yangi buyurtma haqida xabar yuboriladi.
 * Xato bo'lsa buyurtma baribir saqlangan hisoblanadi.
 */
export async function notifyTelegram(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const text = [
    "🛒 Yangi buyurtma!",
    `Mahsulot: ${order.productName}`,
    `Ism: ${order.name}`,
    `Telefon: ${order.phone}`,
    `Til: ${order.lang === "ru" ? "Ruscha" : "O'zbekcha"}`,
  ].join("\n");
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // xabarnoma muvaffaqiyatsiz bo'lsa ham buyurtma saqlanadi
  }
}
