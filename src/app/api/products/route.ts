import { getCatalog } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ommaviy katalog — klient sahifalari shu yerdan o'qiydi */
export async function GET() {
  const products = await getCatalog();
  return Response.json(
    { products },
    { headers: { "cache-control": "no-store" } },
  );
}
