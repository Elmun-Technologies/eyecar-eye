import { isAuthed } from "@/lib/adminAuth";
import { deleteOrder, listOrders, setOrderStatus } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin: buyurtmalar ro'yxati (yangisi birinchi) */
export async function GET(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ orders: await listOrders() });
}

/** Admin: buyurtma holatini o'zgartirish {id, status: new|done} */
export async function PATCH(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  let id = "";
  let status: "new" | "done" = "done";
  try {
    const body = await req.json();
    id = typeof body?.id === "string" ? body.id : "";
    status = body?.status === "new" ? "new" : "done";
  } catch {
    // pastda rad etiladi
  }
  const ok = id ? await setOrderStatus(id, status) : false;
  if (!ok) {
    return Response.json({ error: "Buyurtma topilmadi." }, { status: 404 });
  }
  return Response.json({ ok: true });
}

/** Admin: buyurtmani o'chirish {id} */
export async function DELETE(req: Request) {
  if (!isAuthed(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  let id = "";
  try {
    const body = await req.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    // pastda rad etiladi
  }
  const ok = id ? await deleteOrder(id) : false;
  if (!ok) {
    return Response.json({ error: "Buyurtma topilmadi." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
