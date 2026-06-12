import Link from "next/link";
import { EyeScanIcon, DropBottleIcon } from "./icons";

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 11.5 12 4l8 7.5M6.5 10v9h4v-5h3v5h4v-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Natija/ma'lumot sahifalaridagi qotirilgan pastki menyu */
export function BottomNav() {
  const items = [
    { href: "/", label: "Bosh sahifa", icon: <HomeIcon className="h-7 w-7" /> },
    {
      href: "/check",
      label: "Ko'zni AI tekshiruvi",
      icon: <EyeScanIcon className="h-7 w-7" />,
    },
    {
      href: "/search",
      label: "Tomchi qidiruvi",
      icon: <DropBottleIcon className="h-7 w-7" />,
    },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-[#dfe6f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-3 px-5 pb-[max(env(safe-area-inset-bottom),10px)] pt-2.5">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="flex w-[31%] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-b from-[#e6eefa] to-[#cdddf2] px-1 py-2 text-center shadow-md transition active:scale-[0.96]"
          >
            {it.icon}
            <span className="text-[10.5px] font-extrabold leading-tight">
              {it.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
