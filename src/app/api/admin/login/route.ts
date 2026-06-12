import {
  authConfigured,
  checkPassword,
  clearSessionCookie,
  sessionCookie,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Kirish: {password} → sessiya cookie */
export async function POST(req: Request) {
  if (!authConfigured()) {
    return Response.json(
      {
        error:
          "ADMIN_PASSWORD o'rnatilmagan. Vercel'da Settings → Environment Variables bo'limidan kamida 8 belgili parol qo'shib, qayta deploy qiling.",
      },
      { status: 503 },
    );
  }
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    // bo'sh qoladi — pastda rad etiladi
  }
  if (!checkPassword(password)) {
    return Response.json({ error: "Parol noto'g'ri." }, { status: 401 });
  }
  return Response.json(
    { ok: true },
    { headers: { "set-cookie": sessionCookie() } },
  );
}

/** Chiqish: cookie tozalanadi */
export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { "set-cookie": clearSessionCookie() } },
  );
}
