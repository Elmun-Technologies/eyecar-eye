import { CameraIcon } from "./icons";

/**
 * Yo'riqnoma bosqichidagi namuna ko'rinish: rasm o'rnida illyustratsiya,
 * ustida yashil oval ramka va kamera tugmasi.
 */
export function FaceGuide({ className }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-xl bg-[#efe3d8] ${className ?? ""}`}
    >
      <svg viewBox="0 0 200 220" className="block h-auto w-full" aria-hidden>
        <rect width="200" height="220" fill="#efe3d8" />
        {/* fon doiralari */}
        <circle cx="170" cy="30" r="40" fill="#e7d4c3" />
        <circle cx="20" cy="190" r="46" fill="#e7d4c3" />
        {/* sochlar */}
        <path
          d="M100 28c-34 0-52 24-52 56v52c0 26 12 44 24 54l8 6h40l8-6c12-10 24-28 24-54V84c0-32-18-56-52-56Z"
          fill="#2e2233"
        />
        {/* bo'yin va yelka */}
        <rect x="86" y="158" width="28" height="30" rx="10" fill="#eab88f" />
        <path
          d="M40 220c6-22 28-32 60-32s54 10 60 32H40Z"
          fill="#e8a13e"
        />
        {/* yuz */}
        <ellipse cx="100" cy="106" rx="40" ry="48" fill="#f6c79b" />
        {/* soch oldi */}
        <path
          d="M62 92c-2-30 14-50 38-50s40 20 38 50c-4-12-12-22-18-24-8 6-30 8-44 4-6 4-12 12-14 20Z"
          fill="#2e2233"
        />
        {/* quloqlar */}
        <ellipse cx="59" cy="112" rx="7" ry="10" fill="#eab88f" />
        <ellipse cx="141" cy="112" rx="7" ry="10" fill="#eab88f" />
        {/* sirg'a */}
        <circle cx="141" cy="124" r="5" fill="none" stroke="#d8a432" strokeWidth="2.4" />
        {/* qoshlar */}
        <path
          d="M74 96c5-4 14-4 19-1M107 95c5-3 14-3 19 1"
          stroke="#3c2c40"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* ko'zlar */}
        <ellipse cx="83" cy="108" rx="6.5" ry="4.6" fill="#fff" />
        <ellipse cx="117" cy="108" rx="6.5" ry="4.6" fill="#fff" />
        <circle cx="83" cy="108" r="3.2" fill="#3a2a22" />
        <circle cx="117" cy="108" r="3.2" fill="#3a2a22" />
        {/* burun */}
        <path
          d="M99 116c1 5 1 8-2 10"
          stroke="#dd9d6c"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* tabassum */}
        <path
          d="M84 134c5 8 12 11 16 11s11-3 16-11c-8 3-24 3-32 0Z"
          fill="#fff"
          stroke="#c96f5e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* yonoqlar */}
        <ellipse cx="72" cy="124" rx="6" ry="4" fill="#f2a987" opacity="0.6" />
        <ellipse cx="128" cy="124" rx="6" ry="4" fill="#f2a987" opacity="0.6" />
      </svg>

      {/* yashil oval ramka */}
      <svg
        viewBox="0 0 200 220"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <ellipse
          cx="100"
          cy="112"
          rx="62"
          ry="86"
          fill="none"
          stroke="#3fc04f"
          strokeWidth="5"
        />
      </svg>

      {/* kamera tugmasi (oval tepasida) */}
      <div className="absolute left-1/2 top-[9%] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-brand-green bg-white">
        <CameraIcon className="h-5 w-5 text-foreground" />
      </div>
    </div>
  );
}
