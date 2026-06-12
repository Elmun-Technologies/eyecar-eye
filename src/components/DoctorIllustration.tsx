/** Yassi uslubdagi shifokor illyustratsiyasi — bosh sahifa uchun */
export function DoctorIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 340" fill="none" className={className} aria-hidden>
      {/* sochlar (orqa qism) */}
      <path
        d="M58 56c0-26 16-40 32-40s32 14 32 40v50c0 14 6 22 12 26-10 6-22 8-22 8H68s-12-2-22-8c6-4 12-12 12-26V56Z"
        fill="#b9b9c4"
      />
      {/* bo'yin */}
      <rect x="80" y="92" width="20" height="22" rx="8" fill="#f0c8ae" />
      {/* yuz */}
      <ellipse cx="90" cy="66" rx="26" ry="30" fill="#f7d6bd" />
      {/* soch old qismi */}
      <path
        d="M64 60c-2-22 10-36 26-36s28 14 26 36c-1-8-8-16-14-16-4 6-18 8-30 6-4 2-7 6-8 10Z"
        fill="#c4c4cf"
      />
      {/* ko'zlar, qosh, tabassum */}
      <circle cx="80" cy="64" r="2.6" fill="#2b2b33" />
      <circle cx="102" cy="64" r="2.6" fill="#2b2b33" />
      <path
        d="M75 56c2.5-2 7-2 9.5-.5M97 55.5c2.5-1.5 7-1.5 9.5 0"
        stroke="#9b9ba6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M84 78c3.5 3 8.5 3 12 0"
        stroke="#d99a73"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* lablar rangi */}
      <path
        d="M84 78c3.5 3 8.5 3 12 0"
        stroke="#cf7d6d"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* ichki kiyim */}
      <path d="M68 112h44l-4 36H72l-4-36Z" fill="#a9a9c9" />
      {/* oq xalat */}
      <path
        d="M52 132c4-14 14-20 24-20l14 16 14-16c10 0 20 6 24 20l6 76c1 8-4 12-10 12H56c-6 0-11-4-10-12l6-76Z"
        fill="#fbfbfd"
      />
      {/* xalat ochilishi */}
      <path
        d="M90 128 76 112l-8 6 16 18 6-8ZM90 128l14-16 8 6-16 18-6-8Z"
        fill="#ececf2"
      />
      <path
        d="M90 136v82"
        stroke="#dcdce4"
        strokeWidth="2.4"
      />
      {/* beyjik */}
      <rect x="58" y="138" width="17" height="22" rx="2.5" fill="#e7e7f0" />
      <rect x="60.5" y="141" width="12" height="3" rx="1.5" fill="#9a9ab8" />
      <rect x="60.5" y="147" width="12" height="2.2" rx="1.1" fill="#c2c2d4" />
      <rect x="60.5" y="151" width="8" height="2.2" rx="1.1" fill="#c2c2d4" />
      {/* cho'ntak */}
      <path d="M104 196h22v18h-22z" fill="#ececf2" />
      {/* planshet ushlagan qo'l */}
      <path
        d="M124 150c8 2 12 10 12 20v34c0 8-6 10-10 8l-14-6 12-56Z"
        fill="#fbfbfd"
      />
      <rect
        x="106"
        y="186"
        width="34"
        height="44"
        rx="4"
        transform="rotate(8 106 186)"
        fill="#cfd6e6"
      />
      <rect
        x="111"
        y="191"
        width="24"
        height="33"
        rx="2"
        transform="rotate(8 111 191)"
        fill="#f5f7fb"
      />
      <path
        d="M115 199l18 2.5M114 206l18 2.5M113 213l13 1.8"
        stroke="#aab2c8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="128" cy="232" rx="9" ry="7" fill="#f0c8ae" />
      {/* chap qo'l */}
      <path
        d="M56 150c-8 2-12 10-12 20v36c0 6 4 10 9 10s9-4 9-10v-30l-6-26Z"
        fill="#fbfbfd"
      />
      <ellipse cx="53" cy="218" rx="8" ry="9" fill="#f0c8ae" />
      {/* yubka */}
      <path d="M62 220h56l6 44H56l6-44Z" fill="#b9b9c4" />
      {/* oyoqlar */}
      <rect x="72" y="262" width="13" height="56" rx="6" fill="#f0c8ae" />
      <rect x="95" y="262" width="13" height="56" rx="6" fill="#f0c8ae" />
      {/* tuflilar */}
      <path
        d="M70 316c0-3 3-5 8-5s9 2 10 5l1 6H69l1-6ZM93 316c0-3 3-5 8-5s9 2 10 5l1 6H92l1-6Z"
        fill="#2b2b33"
      />
    </svg>
  );
}
