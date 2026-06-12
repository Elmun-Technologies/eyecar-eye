import { storageReady } from "@/lib/catalog";
import { notifyTelegram, saveOrder, validateOrderInput } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ommaviy: sotib olish zayavkasini qabul qiladi (ism + telefon) */
export async function POST(req: Request) {
  if (!storageReady()) {
    return Response.json(
      { error: "Buyurtmalar qabul qilish hozircha sozlanmagan." },
      { status: 503 },
    );
  }
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // pastda rad etiladi
  }
  // Oddiy anti-spam: yashirin maydon to'ldirilgan bo'lsa — bot
  if (
    typeof body === "object" &&
    body !== null &&
    (body as Record<string, unknown>).website
  ) {
    return Response.json({ ok: true });
  }
  const input = validateOrderInput(body);
  if (!input) {
    return Response.json(
      { error: "Ism va telefon raqamini to'g'ri kiriting." },
      { status: 400 },
    );
  }
  const order = await saveOrder(input);
  await notifyTelegram(order);
  return Response.json({ ok: true });
}
