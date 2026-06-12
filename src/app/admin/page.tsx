"use client";

/**
 * Mahsulotlar boshqaruv paneli (faqat distribyutor uchun, o'zbek tilida).
 * Kirish ADMIN_PASSWORD bilan; katalog Vercel Blob'da saqlanadi.
 * Hech qanday havola ko'rsatilmaydi — sahifa /admin manzilidan ochiladi.
 */

import { useCallback, useEffect, useState } from "react";
import type {
  FeatureId,
  Localized,
  Product,
  SceneId,
  SymptomId,
} from "@/config/site";

type View = "loading" | "login" | "panel";

const SYMPTOMS: Array<{ id: SymptomId; label: string }> = [
  { id: "tired", label: "Charchoq" },
  { id: "dry", label: "Quruqlik" },
  { id: "blur", label: "Xiralik" },
  { id: "itch", label: "Qichishish" },
  { id: "red", label: "Qizarish" },
  { id: "contact", label: "Linza noqulayligi" },
];
const SCENES: Array<{ id: SceneId; label: string }> = [
  { id: "naked", label: "Linzasiz" },
  { id: "soft", label: "Yumshoq linza" },
  { id: "hard", label: "Qattiq linza" },
];
const FEATURES: Array<{ id: FeatureId; label: string }> = [
  { id: "vitaminA", label: "A vitamini bilan" },
  { id: "preservativeFree", label: "Konservantsiz" },
];
const LEVELS: Array<{ id: Product["recommendFor"][number]; label: string }> = [
  { id: "good", label: "Yaxshi" },
  { id: "moderate", label: "O'rtacha" },
  { id: "attention", label: "E'tibor talab" },
];

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/['ʻʼ’`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || `mahsulot-${Date.now()}`
  );
}

function emptyProduct(): Product {
  return {
    id: "",
    name: "",
    short: { uz: "", ru: "" },
    description: { uz: "", ru: "" },
    symptoms: [],
    cooling: 0,
    features: [],
    scenes: ["naked"],
    recommendFor: ["moderate"],
    url: "",
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold text-foreground/60">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-foreground/15 bg-white px-3 py-2.5 text-[15px] font-medium outline-none focus:border-[#7b6ce4]";

function LocalizedInputs({
  label,
  value,
  multiline,
  onChange,
}: {
  label: string;
  value: Localized;
  multiline?: boolean;
  onChange: (v: Localized) => void;
}) {
  const El = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {(["uz", "ru"] as const).map((l) => (
        <Field key={l} label={`${label} (${l.toUpperCase()})`}>
          <El
            value={value[l]}
            rows={multiline ? 3 : undefined}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onChange({ ...value, [l]: e.target.value })}
            className={inputCls}
          />
        </Field>
      ))}
    </div>
  );
}

function CheckGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Array<{ id: T; label: string }>;
  selected: T[];
  onChange: (v: T[]) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs font-extrabold text-foreground/60">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                onChange(
                  on ? selected.filter((x) => x !== o.id) : [...selected, o.id],
                )
              }
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                on
                  ? "bg-accent-dark text-white"
                  : "bg-white text-foreground/70 border border-foreground/15"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductEditor({
  product,
  onChange,
  onDelete,
  onMove,
}: {
  product: Product;
  onChange: (p: Product) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(product.name === "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Yuklashda xatolik");
      onChange({ ...product, image: data.url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="rounded-2xl bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="min-w-0 flex-1 text-left font-extrabold"
        >
          <span className="mr-2 text-foreground/40">{open ? "▾" : "▸"}</span>
          {product.name || "Yangi mahsulot"}
        </button>
        <button
          type="button"
          onClick={() => onMove(-1)}
          aria-label="Yuqoriga"
          className="rounded-lg bg-white px-2.5 py-1.5 text-sm font-bold shadow-sm"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          aria-label="Pastga"
          className="rounded-lg bg-white px-2.5 py-1.5 text-sm font-bold shadow-sm"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`«${product.name || "Yangi mahsulot"}» o'chirilsinmi?`))
              onDelete();
          }}
          className="rounded-lg bg-white px-2.5 py-1.5 text-sm font-bold text-brand-red shadow-sm"
        >
          O'chirish
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <Field label="Nomi">
            <input
              value={product.name}
              onChange={(e) => {
                const name = e.target.value;
                onChange({
                  ...product,
                  name,
                  id: product.id || slugify(name),
                });
              }}
              className={inputCls}
            />
          </Field>
          <LocalizedInputs
            label="Qisqa tavsif"
            value={product.short}
            onChange={(short) => onChange({ ...product, short })}
          />
          <LocalizedInputs
            label="To'liq tavsif"
            value={product.description}
            multiline
            onChange={(description) => onChange({ ...product, description })}
          />
          <CheckGroup
            label="Qaysi belgilarda tavsiya qilinadi"
            options={SYMPTOMS}
            selected={product.symptoms}
            onChange={(symptoms) => onChange({ ...product, symptoms })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Salqinlik (0–7)">
              <select
                value={product.cooling}
                onChange={(e) =>
                  onChange({ ...product, cooling: Number(e.target.value) })
                }
                className={inputCls}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Do'kon / brend havolasi">
              <input
                value={product.url ?? ""}
                placeholder="https://…"
                onChange={(e) => onChange({ ...product, url: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <CheckGroup
            label="Xususiyatlar"
            options={FEATURES}
            selected={product.features}
            onChange={(features) => onChange({ ...product, features })}
          />
          <CheckGroup
            label="Foydalanish holatlari"
            options={SCENES}
            selected={product.scenes}
            onChange={(scenes) => onChange({ ...product, scenes })}
          />
          <CheckGroup
            label="AI tekshiruv natijasida tavsiya darajalari"
            options={LEVELS}
            selected={product.recommendFor}
            onChange={(recommendFor) => onChange({ ...product, recommendFor })}
          />

          {/* Surat */}
          <div>
            <span className="mb-1 block text-xs font-extrabold text-foreground/60">
              Mahsulot surati
            </span>
            <div className="flex items-center gap-3">
              {product.image ? (
                /* eslint-disable-next-line @next/next/no-img-element -- blob URL preview */
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl bg-white object-contain p-1"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-xs font-bold text-foreground/40">
                  Yo'q
                </span>
              )}
              <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
                {uploading ? "Yuklanmoqda…" : "Surat tanlash"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f);
                    e.target.value = "";
                  }}
                />
              </label>
              {product.image && (
                <button
                  type="button"
                  onClick={() => onChange({ ...product, image: undefined })}
                  className="text-sm font-bold text-brand-red"
                >
                  Olib tashlash
                </button>
              )}
            </div>
            {uploadError && (
              <p className="mt-1 text-xs font-bold text-brand-red">
                {uploadError}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [storage, setStorage] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        setView("login");
        return;
      }
      const data = await res.json();
      setItems(data.products ?? []);
      setStorage(Boolean(data.storageReady));
      setView("panel");
    } catch {
      setError("Ma'lumotlarni yuklab bo'lmadi. Sahifani yangilang.");
      setView("login");
    }
  }, []);

  useEffect(() => {
    // sessiya holati faqat serverdan ma'lum — mount'da bir marta so'raladi
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    void load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Kirishda xatolik");
      setPassword("");
      await load();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Kirishda xatolik");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setView("login");
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    const prepared = items.map((p) => ({
      ...p,
      id: p.id || slugify(p.name),
      url: p.url?.trim() || undefined,
    }));
    const invalid = prepared.find(
      (p) =>
        !p.name.trim() ||
        !p.short.uz.trim() ||
        !p.short.ru.trim() ||
        !p.description.uz.trim() ||
        !p.description.ru.trim() ||
        p.symptoms.length === 0,
    );
    if (invalid) {
      setError(
        `«${invalid.name || "Yangi mahsulot"}»: nom, ikkala tildagi tavsiflar va kamida bitta belgi to'ldirilishi shart.`,
      );
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ products: prepared }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Saqlashda xatolik");
      setItems(prepared);
      setMessage(
        `Saqlandi (${data.count} ta mahsulot). O'zgarishlar saytda ~1 daqiqada ko'rinadi.`,
      );
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Saqlashda xatolik");
    } finally {
      setBusy(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
  };

  if (view === "loading") {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center p-6">
        <p className="font-bold text-foreground/60">Yuklanmoqda…</p>
      </main>
    );
  }

  if (view === "login") {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
        <h1 className="text-center text-xl font-extrabold">
          Boshqaruv paneli
        </h1>
        <form onSubmit={login} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            autoFocus
            className={inputCls}
          />
          {error && (
            <p className="text-sm font-bold text-brand-red">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="w-full rounded-full bg-accent-dark py-3.5 font-bold text-white transition hover:bg-accent-dark-hover disabled:opacity-50"
          >
            {busy ? "Tekshirilmoqda…" : "Kirish"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-5 pb-16">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Mahsulotlar boshqaruvi</h1>
        <button
          onClick={logout}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm"
        >
          Chiqish
        </button>
      </header>

      {!storage && (
        <p className="mt-4 rounded-2xl bg-[#fff3d6] p-4 text-sm font-bold leading-relaxed text-[#8a6200]">
          Blob storage hali ulanmagan — o'zgarishlarni saqlab bo'lmaydi.
          Vercel'da loyiha sahifasidan <b>Storage → Create → Blob</b> yarating,
          so'ng qayta deploy qiling.
        </p>
      )}

      <section className="mt-5 space-y-3">
        {items.map((p, i) => (
          <ProductEditor
            key={p.id || `new-${i}`}
            product={p}
            onChange={(np) =>
              setItems(items.map((x, xi) => (xi === i ? np : x)))
            }
            onDelete={() => setItems(items.filter((_, xi) => xi !== i))}
            onMove={(dir) => move(i, dir)}
          />
        ))}
      </section>

      <button
        onClick={() => setItems([...items, emptyProduct()])}
        className="mt-4 w-full rounded-full border-2 border-dashed border-foreground/25 py-3.5 font-bold text-foreground/60 transition hover:border-foreground/40"
      >
        + Yangi mahsulot qo'shish
      </button>

      {error && (
        <p className="mt-4 text-sm font-bold text-brand-red">{error}</p>
      )}
      {message && (
        <p className="mt-4 text-sm font-bold text-brand-green-deep">
          {message}
        </p>
      )}

      <button
        onClick={save}
        disabled={busy || !storage || items.length === 0}
        className="mt-4 w-full rounded-full bg-accent-dark py-4 font-bold text-white transition hover:bg-accent-dark-hover disabled:opacity-50"
      >
        {busy ? "Saqlanmoqda…" : "Hammasini saqlash"}
      </button>

      <p className="mt-3 text-center text-xs text-foreground/50">
        Mahsulotlar tartibi saytdagi karusel tartibini belgilaydi.
      </p>
    </main>
  );
}
