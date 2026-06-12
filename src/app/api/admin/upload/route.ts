import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/adminAuth";
import { storageReady } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 4 * 1024 * 1024; // Vercel funksiyasi body chegarasidan kichik
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Mahsulot suratini Blob'ga yuklaydi, ommaviy URL qaytaradi */
export async function POST(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!storageReady()) {
    return Response.json(
      {
        error:
          "Blob storage ulanmagan. Vercel'da Storage → Create → Blob yarating va qayta deploy qiling.",
      },
      { status: 503 },
    );
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Fayl topilmadi." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return Response.json(
      { error: "Faqat JPG, PNG yoki WebP surat yuklash mumkin." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Surat 4 MB dan kichik bo'lishi kerak." },
      { status: 400 },
    );
  }
  const blob = await put(`products/${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });
  return Response.json({ url: blob.url });
}
