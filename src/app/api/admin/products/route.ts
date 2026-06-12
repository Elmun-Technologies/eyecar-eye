import { isAuthed } from "@/lib/adminAuth";
import {
  getCatalog,
  saveCatalog,
  storageReady,
  validateCatalog,
} from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin uchun joriy katalog + saqlash holati */
export async function GET(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({
    products: await getCatalog(),
    storageReady: storageReady(),
  });
}

/** Katalogni butunlay almashtirib saqlaydi */
export async function PUT(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!storageReady()) {
    return Response.json(
      {
        error:
          "Blob storage ulanmagan. Vercel'da loyiha sahifasidan Storage → Create → Blob yarating va qayta deploy qiling.",
      },
      { status: 503 },
    );
  }
  let items;
  try {
    const body = await req.json();
    items = validateCatalog(body?.products);
  } catch {
    items = null;
  }
  if (!items) {
    return Response.json(
      { error: "Katalog ma'lumotlari noto'g'ri to'ldirilgan." },
      { status: 400 },
    );
  }
  await saveCatalog(items);
  return Response.json({ ok: true, count: items.length });
}
