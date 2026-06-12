import { BottomNav } from "@/components/BottomNav";
import { DropBottleIcon } from "@/components/icons";
import { products, site } from "@/config/site";

export const metadata = {
  title: `Ko'z tomchilari — ${site.brand}`,
};

export default function ProductsPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-32 pt-8">
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <header className="relative flex items-center gap-3">
        <DropBottleIcon className="h-9 w-9 text-foreground" />
        <h1 className="text-xl font-extrabold">Ko'z tomchilari</h1>
      </header>
      <p className="relative mt-2 text-sm leading-relaxed text-foreground/70">
        LION «Smile» liniyasining ko'z salomatligi uchun mo'ljallangan
        tomchilari — rasmiy distribyutordan.
      </p>

      <section className="relative mt-5 space-y-4">
        {products.map((p) => (
          <article
            key={p.id}
            className="rounded-3xl bg-surface p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#d9e4f4] to-[#bed4ee]">
                <DropBottleIcon className="h-10 w-10 text-foreground" />
              </span>
              <div className="min-w-0">
                <h2 className="font-extrabold">{p.name}</h2>
                <p className="text-sm font-bold text-foreground/60">
                  {p.short}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">{p.description}</p>
            {p.url && (
              <a
                href={p.url}
                className="mt-4 block w-full rounded-full bg-accent-dark py-3 text-center font-bold text-white transition hover:bg-accent-dark-hover"
              >
                Batafsil
              </a>
            )}
          </article>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}
